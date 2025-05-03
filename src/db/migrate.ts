import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// For migrations, we need a different connection configuration
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  const db = drizzle(migrationClient);

  console.log("Starting migration...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration completed!");

  await migrationClient.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
