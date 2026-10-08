// Database setup: creates the snacks table and seeds initial records.
// Uses Node's built-in SQLite (node:sqlite), so no native packages to compile.
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const db = new DatabaseSync(path.join(__dirname, "..", "snoopysnacks.db"));

// Task 3: snacks table
db.exec(`
  CREATE TABLE IF NOT EXISTS snacks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL CHECK (price >= 0),
    available   INTEGER NOT NULL DEFAULT 1
  )
`);

// Task 4: initial snack records (only inserted if table is empty)
const { count } = db.prepare("SELECT COUNT(*) AS count FROM snacks").get();
if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO snacks (name, category, description, price, available) VALUES (?, ?, ?, ?, ?)"
  );
  // Products and prices taken from the SnoopySnacks Figma (Milestone 1)
  const seed = [
    // Cookies
    ["Snoopy Cookie", "Cookies", "A snack that would not only fill your stomach but also your heart", 89, 1],
    ["Chocolate Chip Cookie", "Cookies", "Soft and chewy chocolate chip cookies", 79, 1],
    ["Red Velvet Cookie", "Cookies", "Rich red velvet with white chocolate", 99, 1],
    ["Biscoff Cookies", "Cookies", "Biscoff cookies brings the perfect balance of rich, caramelized flavor and crunch.", 99, 1],
    // Ice Cream
    ["Pistachio Ice Cream", "Ice Cream", "Pistachio Ice Cream talaga ang the best", 129, 1],
    ["3 Swirled Scoop Strawberry Ice Cream", "Ice Cream", "Soft and Sweet Strawberry from Baguio", 109, 1],
    ["Caramelized Ice Cream", "Ice Cream", "Mas matamis pa sa mga salita niya", 119, 1],
    ["Biscoff Ice Cream", "Ice Cream", "Biscoff Ice Cream on top", 139, 1],
    // Pizza
    ["Classic Cheese Pizza", "Pizza", "Cheese Pull", 459, 1],
    ["Pepperoni Pizza", "Pizza", "No regrets when you order this", 489, 1],
    ["Buffalo Chicken Pizza", "Pizza", "Best one so far", 529, 1],
    ["Hawaiian Pizza", "Pizza", "Hindi mawawala", 409, 1],
    // Drinks
    ["Soda", "Drinks", "Don't forget to drink water", 39, 1],
    ["Boba", "Drinks", "No regrets when you order this", 119, 1],
    ["Coffee", "Drinks", "Best one so far", 149, 1],
    ["Matcha", "Drinks", "Hindi mawawala", 139, 1],
    // Burgers
    ["Double Cheeseburger", "Burgers", "Don't forget to drink water", 179, 1],
    ["Bacon Burger", "Burgers", "No regrets when you order this", 119, 1],
    ["Chicken Burger", "Burgers", "Best one so far", 99, 1],
    ["Cheeseburger", "Burgers", "Hindi mawawala", 129, 1],
    // Donuts
    ["Glazed Donut", "Donuts", "Don't forget to drink water", 39, 1],
    ["Black Jack Donut", "Donuts", "No regrets when you order this", 49, 1],
    ["Blueberry Glazed Donut", "Donuts", "Best one so far", 49, 1],
    ["Alcapone Donut", "Donuts", "Hindi mawawala", 49, 1],
  ];
  db.exec("BEGIN");
  for (const row of seed) insert.run(...row);
  db.exec("COMMIT");
}

module.exports = db;
