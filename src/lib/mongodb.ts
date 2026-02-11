import { MongoClient, Db } from "mongodb";

const dbName = process.env.MONGODB_DB_NAME || "blog_app";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function getClient(): Promise<MongoClient> {
  if (client) return client;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env (see .env.example)."
    );
  }
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri).then((c) => {
      client = c;
      return c;
    });
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const c = await getClient();
  return c.db(dbName);
}

