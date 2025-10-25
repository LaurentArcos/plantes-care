import mysql, { Pool } from "mysql2/promise";

// Singleton pour éviter de recréer le pool à chaud
let _pool: Pool | null = null;

export function getDB(): Pool {
  if (_pool) return _pool;

  const port =
    process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  _pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port,
    user: process.env.DB_USER || "plantes_ro",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "plantes",
    connectionLimit: 6,
    // Ces options existent bien dans mysql2
    supportBigNumbers: true,
    bigNumberStrings: true,
    charset: "utf8mb4_general_ci",
  });

  return _pool;
}

export const db = getDB();
