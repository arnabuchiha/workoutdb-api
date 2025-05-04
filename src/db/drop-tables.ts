import postgres from "postgres";
import * as dotenv from "dotenv";
dotenv.config({ path: ".dev.vars" });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function dropTables() {
  try {
    console.log("Dropping existing tables...");

    // Drop tables in correct order (respecting foreign key constraints)
    await sql`DROP TABLE IF EXISTS workouts CASCADE`;
    await sql`DROP TABLE IF EXISTS muscles CASCADE`;
    await sql`DROP TABLE IF EXISTS apikey CASCADE`;
    await sql`DROP TABLE IF EXISTS verification CASCADE`;
    await sql`DROP TABLE IF EXISTS account CASCADE`;
    await sql`DROP TABLE IF EXISTS session CASCADE`;
    await sql`DROP TABLE IF EXISTS "user" CASCADE`;
    await sql`DROP TABLE IF EXISTS "workout_muscle_activations" CASCADE`;

    console.log("Tables dropped successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to drop tables:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

dropTables();
