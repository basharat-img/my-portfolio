import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

const configureCommonInterceptors = (instance) => {
  instance.interceptors.request.use((config) => {
    const nextConfig = { ...config };
    nextConfig.headers = { ...(nextConfig.headers || {}) };

    if (
      nextConfig.data !== undefined &&
      !(nextConfig.data instanceof FormData) &&
      typeof nextConfig.data === "object"
    ) {
      const hasContentTypeHeader = Object.keys(nextConfig.headers).some(
        (header) => header.toLowerCase() === "content-type",
      );

      if (!hasContentTypeHeader) {
        nextConfig.headers["Content-Type"] = "application/json";
      }
    }

    nextConfig.headers.Accept = nextConfig.headers.Accept || "application/json";

    return nextConfig;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred while communicating with the server.";
      throw new Error(message);
    },
  );
};

export const createPublicApi = () => {
  const instance = axios.create({
    baseURL,
    headers: { Accept: "application/json" },
    withCredentials: true,
  });

  configureCommonInterceptors(instance);
  return instance;
};

export const createAuthenticatedApi = (tokenOrGetter) => {
  const instance = axios.create({
    baseURL,
    headers: { Accept: "application/json" },
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = typeof tokenOrGetter === "function" ? tokenOrGetter() : tokenOrGetter;
    if (token) {
      const nextConfig = { ...config };
      nextConfig.headers = { ...(nextConfig.headers || {}) };
      nextConfig.headers.Authorization = `Bearer ${token}`;
      return nextConfig;
    }
    return config;
  });

  configureCommonInterceptors(instance);
  return instance;
};

export const publicApi = createPublicApi();
