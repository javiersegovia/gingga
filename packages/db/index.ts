import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { dbEnv } from "./env";

export function createDatabaseClient() {
  console.log(
    "[CREATING DB CLIENT] - Variables found:",
    Object.keys(process.env)?.length
  );

  // TODO: Check if we can initialize the dbEnv only once, instead of every time we call this function
  const { DATABASE_URL, TURSO_AUTH_TOKEN } = dbEnv();

  const client = createClient({
    url: DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export type DatabaseType = Awaited<ReturnType<typeof createDatabaseClient>>;
export * from "drizzle-orm";
