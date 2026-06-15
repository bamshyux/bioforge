import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* no env file */
  }
}

loadEnv();

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL in .env.local.\n\n" +
      "Add your Supabase Postgres connection string:\n" +
      "Supabase Dashboard → Project Settings → Database → Connection string → URI\n\n" +
      "Or run supabase/v17_content_alignment.sql manually in the SQL Editor.",
  );
  process.exit(1);
}

const sqlPath = process.argv[2] ?? "supabase/v17_content_alignment.sql";
const sql = readFileSync(resolve(sqlPath), "utf8");

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log(`Applied migration: ${sqlPath}`);
} catch (error) {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await client.end();
}
