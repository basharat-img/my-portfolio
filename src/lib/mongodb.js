const REQUIRED_ENV_VARS = [
  "MONGODB_DATA_API_URL",
  "MONGODB_DATA_API_KEY",
  "MONGODB_DATA_SOURCE",
  "MONGODB_DATA_DATABASE",
  "MONGODB_DATA_COLLECTION",
];

export function assertMongoConfig() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing MongoDB Data API environment variables: ${missing.join(", ")}`,
    );
  }
  return {
    apiUrl: process.env.MONGODB_DATA_API_URL,
    apiKey: process.env.MONGODB_DATA_API_KEY,
    dataSource: process.env.MONGODB_DATA_SOURCE,
    database: process.env.MONGODB_DATA_DATABASE,
    collection: process.env.MONGODB_DATA_COLLECTION,
  };
}

export async function callMongoDataApi(action, payload) {
  const config = assertMongoConfig();
  const response = await fetch(`${config.apiUrl}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      dataSource: config.dataSource,
      database: config.database,
      collection: config.collection,
      ...payload,
    }),
    cache: "no-store",
  });

  const json = await response.json();
  if (!response.ok) {
    const errorMessage = json.error || "MongoDB Data API request failed";
    throw new Error(errorMessage);
  }
  return json;
}
