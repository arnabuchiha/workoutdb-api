import { relations, SQL, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  jsonb,
  real,
  primaryKey,
  json,
  index,
  customType,
} from "drizzle-orm/pg-core";

export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return `tsvector`;
  },
});

export const vector = customType<{ data: number[] }>({
  dataType() {
    return `vector(84)`;
  },
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const apikey = pgTable("apikey", {
  id: text("id").primaryKey(),
  name: text("name"),
  start: text("start"),
  prefix: text("prefix"),
  key: text("key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  lastRefillAt: timestamp("last_refill_at"),
  enabled: boolean("enabled"),
  rateLimitEnabled: boolean("rate_limit_enabled"),
  rateLimitTimeWindow: integer("rate_limit_time_window"),
  rateLimitMax: integer("rate_limit_max"),
  requestCount: integer("request_count"),
  remaining: integer("remaining"),
  lastRequest: timestamp("last_request"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  permissions: text("permissions"),
  metadata: text("metadata"),
});

// Workouts table, storing core exercise data
export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    externalId: text("external_id").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    bodyPart: text("body_part"),
    equipment: text("equipment"),
    gifUrl: text("gif_url"),
    target: text("target"),
    secondaryMuscles: json("secondary_muscles").$type<string[]>(),
    instructions: json("instructions").$type<string[]>(),
    latestInstructions: json("latest_instructions").$type<string[]>(),
    isPublic: boolean("is_public").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
      setweight(
        json_to_tsvector('english', secondary_muscles,'"all"'),
        'C'
      ) ||
      setweight(
        to_tsvector(
          'english',
          coalesce(target, '') || ' ' || coalesce(body_part, '') || ' ' || coalesce(equipment, '')
        ),
        'D'
      )`,
    ),
    muscleVector: vector("muscle_vector"),
  },
  (table) => [
    index("workouts_search_vector_idx").using("gin", table.searchVector),
    index("workouts_name_trgm_idx").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
    index("workouts_description_trgm_idx").using(
      "gin",
      sql`${table.description} gin_trgm_ops`,
    ),
    index("workouts_muscle_vector_idx").using(
      "hnsw",
      table.muscleVector.op("vector_cosine_ops"),
    ),
  ],
);

// Muscles reference table
export const muscles = pgTable("muscles", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  groupName: text("group_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutMuscleActivations = pgTable("workout_muscle_activations", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }), // ← part of your composite PK
  muscleCode: text("muscle_code")
    .notNull()
    .references(() => muscles.code, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").notNull(),
  activation: real("activation").notNull(),
});
