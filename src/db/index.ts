import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const createDbClient = (url?: string) => {
  // Use the Supabase connection URL from environment
  const connectionString = url ?? process.env.DATABASE_URL!;
  // For edge functions, we want to use a connection pool
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
};

// Export schema for type inference
export type Schema = typeof schema;
export type DbClient = ReturnType<typeof createDbClient>;
