import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

const DATABASE_URL = process.env.DATABASE_URL!;

let _db: ReturnType<typeof drizzle> | null = null;

export function getDB() {
  if (!_db) {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    _db = drizzle(pool, { schema });
  }
  return _db;
}

export async function connectDB() {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");
  getDB();
  console.log("[db] Neon PostgreSQL connected");
}
