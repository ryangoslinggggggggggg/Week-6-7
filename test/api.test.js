// Run with: npm test  (uses Node's built-in test runner, no extra packages)
const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

let server, base;
test.before(() => new Promise((r) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
test.after(() => server.close());

test("GET /api/snacks returns snacks from the database", async () => {
  const res = await fetch(`${base}/api/snacks`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(body.count > 0);
  assert.ok(body.data[0].name && typeof body.data[0].price === "number");
});

test("GET /api/snacks?category=Pizza filters by category", async () => {
  const body = await (await fetch(`${base}/api/snacks?category=Pizza`)).json();
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((s) => s.category === "Pizza"));
});

test("POST /api/signup rejects an invalid username", async () => {
  const res = await fetch(`${base}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "a", password: "longenough1" }),
  });
  assert.strictEqual(res.status, 400);
});

test("POST /api/login rejects a short password", async () => {
  const res = await fetch(`${base}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "validuser", password: "short" }),
  });
  assert.strictEqual(res.status, 400);
});
