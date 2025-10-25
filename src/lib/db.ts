import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "plantes_ro",
  password: process.env.DB_PASS ?? "",
  database: process.env.DB_NAME ?? "plantes",
  connectionLimit: 6,
  supportBigNumbers: true,
  charset: "utf8mb4_general_ci",
});
