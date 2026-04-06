import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

const DATABASE_URL = process.env.DATABASE_URL!;

let _db: ReturnType<typeof drizzle> | null = null;

export function getDB() {
  if (!_db) {
    const sql = neon(DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export async function connectDB() {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");
  getDB(); // initialize connection
  console.log("[db] Neon PostgreSQL connected");
}
