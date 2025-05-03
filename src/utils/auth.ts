import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "better-auth/plugins";
import { createDbClient } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(createDbClient(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },

  plugins: [apiKey()],
});
