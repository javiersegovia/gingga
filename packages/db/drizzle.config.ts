import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

const { DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

if (!DATABASE_URL) throw new Error("Missing DATABASE_URL");
if (!TURSO_AUTH_TOKEN) throw new Error("Missing TURSO_AUTH_TOKEN");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",

  verbose: true,

  dialect: "turso",
  dbCredentials: {
    url: DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },

  migrations: {
    prefix: "timestamp",
  },
});
