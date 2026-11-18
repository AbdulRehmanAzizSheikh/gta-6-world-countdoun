import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var __gta6Mongo: { client: MongoClient; db: Db } | undefined;
}

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!global.__gta6Mongo) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    const db = client.db("gta");
    global.__gta6Mongo = { client, db };
  }

  return global.__gta6Mongo.db;
}

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
