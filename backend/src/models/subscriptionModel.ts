import { Pool } from "pg";

// DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres?schema=public"
const pool = new Pool({
  user: "postgresql",
  host: "db",
  database: "postgresql",
  password: "postgresql",
  port: 5432,
});

export default pool;

export const saveSubscription = async (subscription: any) => {
  await pool.query("INSERT INTO subscriptions (subscription) VALUES ($1)", [
    subscription,
  ]);
};

export const getAllSubscriptions = async () => {
  const result = await pool.query("SELECT subscription FROM subscriptions");
  return result.rows.map((row) => row.subscription);
};
