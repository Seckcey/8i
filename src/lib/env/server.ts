import "server-only";

import { z } from "zod";

const requiredString = z.string().trim().min(1);
const optionalString = z
  .string()
  .trim()
  .min(1)
  .optional();

const adminEmailAllowlist = z
  .string()
  .optional()
  .transform((value) =>
    value
      ? value
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      : [],
  );

export const serverEnvSchema = z.object({
  DATABASE_URL: requiredString,
  DIRECT_URL: optionalString,

  NEXT_PUBLIC_APP_URL: z.string().trim().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requiredString,
  SUPABASE_SERVICE_ROLE_KEY: requiredString,

  STRIPE_SECRET_KEY: requiredString,
  STRIPE_WEBHOOK_SECRET: requiredString,

  OPENAI_API_KEY: requiredString,
  OPENAI_DEFAULT_MODEL: requiredString,

  CREDIT_UNIT_SCALE: z.coerce.bigint().positive(),
  DEFAULT_CREDIT_MARGIN_BPS: z.coerce.number().int().min(0).max(10_000),
  MIN_AI_DEBIT_UNITS: z.coerce.bigint().nonnegative(),

  ADMIN_EMAIL_ALLOWLIST: adminEmailAllowlist,
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  return serverEnvSchema.parse(env);
}
