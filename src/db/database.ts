import { Pool } from "pg";

export const pool = new Pool (
  { connectionString: process.env.DATABASE_URL }
);

export const connectDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Database connected successfully.");
  } catch (error) {
    console.log("Database connection error", error);
    process.exit(1);
  }
};