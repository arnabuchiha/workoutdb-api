import type { DbClient } from "../db";

export interface Env {
  VERSION?: string;
  ENVIRONMENT?: string;
  API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  DATABASE_URL: string;
  RAPID_API_SECRET: string;
  ADMIN_KEY: string;
}

declare global {
  interface Bindings extends Env {}
}
declare module "hono" {
  interface ContextVariableMap {
    db: DbClient;
  }
}
