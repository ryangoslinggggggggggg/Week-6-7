const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SnoopySnacks API is running", endpoints: ["GET /api/snacks"] });
});

// Task 5 + 6: GET /api/snacks, connected to the database
// Optional filters: ?category=Pizza  and  ?available=true
app.get("/api/snacks", (req, res) => {
  try {
    let sql = "SELECT id, name, category, description, price, available FROM snacks";
    const where = [];
    const params = [];

    if (req.query.category) {
      where.push("category = ? COLLATE NOCASE");
      params.push(req.query.category);
    }
    if (req.query.available === "true") where.push("available = 1");

    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY id";

    const rows = db.prepare(sql).all(...params).map((s) => ({ ...s, available: !!s.available }));
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve snacks" });
  }
});

module.exports = app;
