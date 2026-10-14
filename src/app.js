const path = require("path");
const express = require("express");
const db = require("./db");
const adminDb = require("./adminDb");
const { hashPassword, verifyPassword } = require("./password");

const app = express();
app.use(express.json());

// Serves the website (public/index.html, style.css, script.js, auth.js)
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api", (req, res) => {
  res.json({
    message: "SnoopySnacks API is running",
    endpoints: ["GET /api/snacks", "POST /api/signup", "POST /api/login"],
  });
});

// GET /api/snacks, connected to the Supabase database
// Optional filters: ?category=Pizza  and  ?available=true
app.get("/api/snacks", async (req, res) => {
  try {
    let query = db
      .from("snacks")
      .select("id, name, category, description, price, available")
      .order("id");

    if (req.query.category) query = query.ilike("category", String(req.query.category));
    if (req.query.available === "true") query = query.eq("available", true);

    const { data, error } = await query;
    if (error) throw error;

    const rows = data.map((s) => ({ ...s, price: Number(s.price) }));
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve snacks" });
  }
});

// ---- Accounts (users table) ----
const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

function readCredentials(req, res) {
  const username = String(req.body?.username ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  if (!USERNAME_RE.test(username)) {
    res.status(400).json({ error: "Username must be 3-30 characters: letters, numbers, or underscore." });
    return null;
  }
  if (password.length < 8 || password.length > 100) {
    res.status(400).json({ error: "Password must be 8-100 characters." });
    return null;
  }
  return { username, password };
}

function requireAdminDb(res) {
  if (adminDb) return true;
  res.status(503).json({ error: "Accounts are not configured on the server (missing SUPABASE_SERVICE_KEY)." });
  return false;
}

app.post("/api/signup", async (req, res) => {
  const creds = readCredentials(req, res);
  if (!creds || !requireAdminDb(res)) return;
  try {
    const { data, error } = await adminDb
      .from("users")
      .insert({ username: creds.username, password_hash: hashPassword(creds.password) })
      .select("id, username")
      .single();
    if (error) {
      if (error.code === "23505") return res.status(409).json({ error: "That username is already taken." });
      throw error;
    }
    res.status(201).json({ user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create account" });
  }
});

app.post("/api/login", async (req, res) => {
  const creds = readCredentials(req, res);
  if (!creds || !requireAdminDb(res)) return;
  try {
    const { data, error } = await adminDb
      .from("users")
      .select("id, username, password_hash")
      .eq("username", creds.username)
      .maybeSingle();
    if (error) throw error;
    if (!data || !verifyPassword(creds.password, data.password_hash)) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    res.json({ user: { id: data.id, username: data.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

module.exports = app;
