// Server-only Supabase client for the users table (needs the SECRET key, never expose it to the browser).
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

module.exports = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
