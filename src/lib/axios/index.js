class RequestInterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(onFulfilled, onRejected) {
    this.handlers.push({ onFulfilled, onRejected });
    return this.handlers.length - 1;
  }

  async run(config) {
    let currentConfig = { ...config };
    for (const handler of this.handlers) {
      if (!handler) continue;
      const { onFulfilled, onRejected } = handler;
      if (typeof onFulfilled !== "function") continue;
      try {
        currentConfig = await onFulfilled(currentConfig);
      } catch (error) {
        if (typeof onRejected === "function") {
          const maybeResult = await onRejected(error);
          if (maybeResult !== undefined) {
            currentConfig = maybeResult;
            continue;
          }
        }
        throw error;
      }
    }
    return currentConfig;
  }
}

class ResponseInterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(onFulfilled, onRejected) {
    this.handlers.push({ onFulfilled, onRejected });
    return this.handlers.length - 1;
  }

  async handleSuccess(response) {
    let currentResponse = response;
    for (const handler of this.handlers) {
      if (!handler) continue;
      const { onFulfilled } = handler;
      if (typeof onFulfilled !== "function") continue;
      currentResponse = await onFulfilled(currentResponse);
    }
    return currentResponse;
  }

  async handleError(error) {
    let currentError = error;
    for (const handler of this.handlers) {
      if (!handler) continue;
      const { onRejected } = handler;
      if (typeof onRejected !== "function") continue;
      try {
        const maybeValue = await onRejected(currentError);
        if (maybeValue !== undefined) {
          return { resolved: true, value: maybeValue };
        }
      } catch (nextError) {
        currentError = nextError;
      }
    }
    return { resolved: false, error: currentError };
  }
}

function isAbsoluteURL(url) {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url);
}

function combineURL(baseURL = "", requestedURL = "") {
  if (!requestedURL) return baseURL;
  if (!baseURL || isAbsoluteURL(requestedURL)) return requestedURL;
  const normalizedBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedRequest = requestedURL.startsWith("/") ? requestedURL.slice(1) : requestedURL;
  return `${normalizedBase}/${normalizedRequest}`;
}

function appendParams(url, params) {
  if (!params || typeof params !== "object") {
    return url;
  }
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        searchParams.append(key, String(item));
      }
      continue;
    }
    if (typeof value === "object") {
      searchParams.append(key, JSON.stringify(value));
      continue;
    }
    searchParams.append(key, String(value));
  }
  const queryString = searchParams.toString();
  if (!queryString) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${queryString}`;
}

function normalizeHeaders(headers = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(headers)) {
    normalized[key] = value;
  }
  return normalized;
}

function mergeConfigs(defaults, config) {
  const mergedHeaders = {
    ...normalizeHeaders(defaults.headers || {}),
    ...normalizeHeaders(config.headers || {}),
  };

  return {
    ...defaults,
    ...config,
    headers: mergedHeaders,
  };
}

async function parseResponseData(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }
  if (contentType.startsWith("text/")) {
    return response.text();
  }
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function parseHeaders(headers) {
  const parsed = {};
  if (!headers || typeof headers.entries !== "function") {
    return parsed;
  }
  for (const [key, value] of headers.entries()) {
    if (key in parsed) {
      if (Array.isArray(parsed[key])) {
        parsed[key].push(value);
      } else {
        parsed[key] = [parsed[key], value];
      }
    } else {
      parsed[key] = value;
    }
  }
  return parsed;
}

class AxiosInstance {
  constructor(defaultConfig = {}) {
    this.defaults = { ...defaultConfig, headers: normalizeHeaders(defaultConfig.headers || {}) };
    this.interceptors = {
      request: new RequestInterceptorManager(),
      response: new ResponseInterceptorManager(),
    };
  }

  async request(config = {}) {
    const mergedConfig = mergeConfigs(this.defaults, config);
    mergedConfig.method = (mergedConfig.method || "get").toUpperCase();

    const preparedConfig = await this.interceptors.request.run(mergedConfig);

    const { baseURL = this.defaults.baseURL || "", url = "" } = preparedConfig;
    if (!url) {
      throw new Error("Request URL is required.");
    }

    let fullURL = combineURL(baseURL, url);
    fullURL = appendParams(fullURL, preparedConfig.params);

    const requestHeaders = normalizeHeaders(preparedConfig.headers || {});
    const fetchOptions = {
      method: preparedConfig.method,
      headers: requestHeaders,
      signal: preparedConfig.signal,
      credentials: preparedConfig.credentials,
    };

    if (preparedConfig.data !== undefined) {
      if (
        typeof preparedConfig.data === "string" ||
        preparedConfig.data instanceof FormData ||
        preparedConfig.data instanceof Blob
      ) {
        fetchOptions.body = preparedConfig.data;
      } else {
        fetchOptions.body = JSON.stringify(preparedConfig.data);
        if (!("Content-Type" in requestHeaders) && !("content-type" in requestHeaders)) {
          fetchOptions.headers["Content-Type"] = "application/json";
        }
      }
    }

    try {
      const response = await fetch(fullURL, fetchOptions);
      const data = await parseResponseData(response);
      const axiosResponse = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: parseHeaders(response.headers),
        config: preparedConfig,
        request: { url: fullURL, options: fetchOptions },
      };

      if (!response.ok) {
        const errorMessage =
          (data && typeof data === "object" && "message" in data && data.message) ||
          `Request failed with status code ${response.status}`;
        const error = new Error(errorMessage);
        error.response = axiosResponse;
        error.config = preparedConfig;
        throw error;
      }

      return this.interceptors.response.handleSuccess(axiosResponse);
    } catch (error) {
      const handled = await this.interceptors.response.handleError(error);
      if (handled.resolved) {
        return handled.value;
      }
      throw handled.error;
    }
  }

  get(url, config = {}) {
    return this.request({ ...config, method: "GET", url });
  }

  delete(url, config = {}) {
    return this.request({ ...config, method: "DELETE", url });
  }

  head(url, config = {}) {
    return this.request({ ...config, method: "HEAD", url });
  }

  options(url, config = {}) {
    return this.request({ ...config, method: "OPTIONS", url });
  }

  post(url, data, config = {}) {
    return this.request({ ...config, method: "POST", url, data });
  }

  put(url, data, config = {}) {
    return this.request({ ...config, method: "PUT", url, data });
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, method: "PATCH", url, data });
  }
}

const axios = {
  create(config = {}) {
    return new AxiosInstance(config);
  },
};

export default axios;
