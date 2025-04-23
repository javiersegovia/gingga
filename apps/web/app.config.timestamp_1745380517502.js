// app.config.ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import { config } from "dotenv";
import { denyImports, envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

// src/server/env.ts
import { z } from "zod";
var PUBLIC_ENV_PREFIX = "VITE_";
var ServerEnvSchema = createEnvSchema("server", {
  // DATABASE
  DATABASE_URL: z.string().min(1),
  TURSO_AUTH_TOKEN: z.string().min(1),
  TURSO_API_TOKEN: z.string().min(1),
  // SESSION
  SESSION_SECRET: z.string().min(16),
  AUTH_SECRET: z.string().min(16),
  // AUTH SOCIAL PROVIDERS
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_REDIRECT_URI: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  // EMAIL
  RESEND_API_KEY: z.string().startsWith("re_"),
  // AI SERVICES
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  OPENROUTER_API_KEY: z.string().min(1),
  GATEWAY_BASE_OPENAI_URL: z.string().url(),
  GATEWAY_BASE_OPENROUTER_URL: z.string().url(),
  // UPSTASH REDIS
  KV_URL: z.string().url(),
  KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
  REDIS_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(1),
  KV_REST_API_URL: z.string().url(),
  // MONITORING
  SENTRY_AUTH_TOKEN: z.string().min(1),
  // CI/CD
  GH_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  COMPOSIO_API_KEY: z.string().min(1),
  COMPOSIO_GOOGLESHEETS_INTEGRATION_ID: z.string().min(1),
  COMPOSIO_GOOGLECALENDAR_INTEGRATION_ID: z.string().min(1),
  COMPOSIO_GMAIL_INTEGRATION_ID: z.string().min(1),
  COMPOSIO_GOOGLEDOCS_INTEGRATION_ID: z.string().min(1)
});
var ClientEnvSchema = createEnvSchema("client", {
  VITE_SITE_URL: z.string().url(),
  VITE_API_URL: z.string().url(),
  VITE_ASSETS_URL: z.string().url(),
  VITE_RESEND_EMAIL_FROM: z.string().min(1),
  VITE_SUPPORT_EMAIL: z.string().min(1)
});
var EnvSchema = z.object({
  ...ServerEnvSchema.shape,
  ...ClientEnvSchema.shape
});
async function parseEnv() {
  const result = EnvSchema.safeParse({ ...process.env });
  if (result.error) {
    console.error(result.error.message);
    throw new Error("Invalid environment variables");
  }
  const total = Object.keys(result.data).length;
  console.log(`Environment variables parsed successfully (${total} variables)`);
}
function createEnvSchema(type, shape) {
  for (const key in shape) {
    if (type === "client" && !key.startsWith(PUBLIC_ENV_PREFIX)) {
      throw new Error(
        `Public environment variables must start with "${PUBLIC_ENV_PREFIX}", got "${key}"`
      );
    }
    if (type === "server" && key.startsWith(PUBLIC_ENV_PREFIX)) {
      throw new Error(
        `Private environment variables must not start with "${PUBLIC_ENV_PREFIX}", got "${key}"`
      );
    }
  }
  return z.object(shape);
}

// app.config.ts
config();
await parseEnv();
var app_config_default = defineConfig({
  server: {
    preset: "vercel",
    rollupConfig: {
      external: ["node:async_hooks"]
    }
  },
  // https://react.dev/learn/react-compiler
  react: {
    babel: {
      plugins: [
        [
          "babel-plugin-react-compiler",
          {
            target: "19"
          }
        ]
      ]
    }
  },
  tsr: {
    routeFileIgnorePrefix: "_components",
    quoteStyle: "single",
    semicolons: false,
    appDirectory: "src"
  },
  vite: {
    define: await defineVitePublicEnv(),
    plugins: [
      tsconfigPaths({
        projects: ["./tsconfig.json"]
      }),
      tailwindcss(),
      envOnlyMacros(),
      denyImports({
        client: { files: ["**/server/*", "**/*.server.*"] }
      })
    ]
  }
});
async function defineVitePublicEnv() {
  const env = process.env;
  const viteDefine = Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith("VITE_")).map(([key, value]) => [`import.meta.env.${key}`, `"${value}"`])
  );
  return viteDefine;
}
export {
  app_config_default as default
};
