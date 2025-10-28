import { MongoClient } from "mongodb";

const globalForMongo = globalThis;

let clientPromise;

function getMongoConfig() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME environment variable.");
  }

  const adminsCollection =
    process.env.MONGODB_ADMINS_COLLECTION?.trim() || "admins";

  return { uri, dbName, adminsCollection };
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
