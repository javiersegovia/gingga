import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const dbEnv = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string().min(1).url(),
      TURSO_AUTH_TOKEN: z.string().min(1),
      TURSO_API_TOKEN: z.string().min(1),
    },
    runtimeEnv: process.env,
  });
