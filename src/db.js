// Database connection: Supabase (hosted Postgres).
// The snacks table and seed data live in supabase/schema.sql (run it once in the Supabase SQL Editor).
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY. Copy .env.example to .env and fill them in.");
}

module.exports = createClient(url, key, { auth: { persistSession: false } });
