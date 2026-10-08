# SnoopySnacks API — Sprint 1 Increment

Node.js + Express backend with Node built-in SQLite (needs Node 22.13 or newer).

## Run
```bash
npm install
npm start        # http://localhost:3000
npm test
```

## Endpoint
`GET /api/snacks` — returns all snacks from the `snacks` table.
Optional query params: `?category=Pizza`, `?available=true`

Example response:
```json
{ "count": 24, "data": [ { "id": 1, "name": "Snoopy Cookie", "category": "Cookies", "description": "...", "price": 20, "available": true } ] }
```

## Structure
- `server.js` — starts the server
- `src/db.js` — creates the `snacks` table and seeds initial records
- `src/app.js` — Express app and routes
- `test/api.test.js` — API tests
