import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("No DATABASE_URL found in environment variables");
  return neon(url);
}

export const sql = getSQL();