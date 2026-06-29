import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().trim().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function getClientEnv(env: NodeJS.ProcessEnv = process.env): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
