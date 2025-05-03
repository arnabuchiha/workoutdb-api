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
  // Add other environment variables as needed
}

// Extend Bindings for Cloudflare Workers
declare global {
  interface Bindings extends Env {}
}

// Add database client to Hono context
declare module "hono" {
  interface ContextVariableMap {
    db: DbClient;
  }
}
