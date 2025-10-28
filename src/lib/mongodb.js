import { MongoClient } from "mongodb";

const globalForMongo = globalThis;

let clientPromise;

function extractDbName(uri) {
  const configured = process.env.MONGODB_DB?.trim();
  if (configured) {
    return configured;
  }

  const uriWithoutQuery = uri.split("?")[0];
  const doubleSlashIndex = uriWithoutQuery.indexOf("//");
  if (doubleSlashIndex === -1) {
    return undefined;
  }

  const pathStartIndex = uriWithoutQuery.indexOf(
    "/",
    doubleSlashIndex + 2,
  );
  if (pathStartIndex === -1) {
    return undefined;
  }

  const path = uriWithoutQuery.slice(pathStartIndex + 1).trim();
  if (!path) {
    return undefined;
  }

  return path;
}

function getMongoConfig() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const adminsCollection =
    process.env.MONGODB_ADMINS_COLLECTION?.trim() || "admins";
  const dbName =
    extractDbName(uri) || process.env.MONGODB_DEFAULT_DB?.trim() || "portfolio";

  return { uri, adminsCollection, dbName };
}

function createClientPromise() {
  const { uri } = getMongoConfig();
  const client = new MongoClient(uri, {
    maxIdleTimeMS: 60_000,
    serverSelectionTimeoutMS: 5_000,
  });
  return client.connect();
}

if (!globalForMongo._mongoClientPromise) {
  globalForMongo._mongoClientPromise = createClientPromise();
}

clientPromise = globalForMongo._mongoClientPromise;

export async function getAdminsCollection() {
  const { dbName, adminsCollection } = getMongoConfig();
  const client = await clientPromise;
  return client.db(dbName).collection(adminsCollection);
}
