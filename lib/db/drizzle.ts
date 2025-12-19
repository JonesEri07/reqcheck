import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

// Use a global singleton pattern to prevent multiple client instances
// This is important in Next.js development mode with hot reloading
declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: postgres.Sql | undefined;
}

// Lazy initialization function
function getClient() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  if (global.__postgresClient) {
    return global.__postgresClient;
  }

  const connectionString = process.env.POSTGRES_URL;

  // Create a singleton postgres client with connection pooling
  // max: Maximum number of connections in the pool (default is 10)
  // idle_timeout: How long to keep idle connections (in seconds)
  // max_lifetime: Maximum lifetime of a connection (in seconds)
  const client = postgres(connectionString, {
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    max_lifetime: 60 * 30, // Close connections after 30 minutes
    connect_timeout: 10, // Connection timeout in seconds
  });

  // In development, store the client globally to prevent multiple instances
  if (process.env.NODE_ENV !== "production") {
    global.__postgresClient = client;
  }

  return client;
}

// Export client as a getter that initializes lazily
export const client = new Proxy({} as postgres.Sql, {
  get(_target, prop) {
    return getClient()[prop as keyof postgres.Sql];
  },
});

// Export db with lazy initialization
let _db: ReturnType<typeof drizzle> | undefined;
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db) {
      _db = drizzle(getClient(), { schema });
    }
    return _db[prop as keyof typeof _db];
  },
});
