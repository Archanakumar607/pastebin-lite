const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.urlencoded({ extended: true }));

// ---- DATABASE ----
const db = new sqlite3.Database("pastes.db");

db.run(`
CREATE TABLE IF NOT EXISTS pastes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
)
`);

// ---- HOME PAGE ----
app.get("/", (req, res) => {
  res.send(`
    <h1>Pastebin Lite</h1>
    <form method="POST" action="/save">
      <textarea name="content" rows="6" cols="50" required></textarea><br><br>
      <button type="submit">Save Paste</button>
    </form>
  `);
});

// ---- SAVE PASTE (FORM POST) ----
app.post("/save", (req, res) => {
  const content = req.body.content;

  db.run(
    "INSERT INTO pastes (content) VALUES (?)",
    [content],
    function (err) {
      if (err) {
        return res.send("Database error");
      }
      res.redirect(`/paste/${this.lastID}`);
    }
  );
});

// ---- VIEW PASTE ----
app.get("/paste/:id", (req, res) => {
  db.get(
    "SELECT content FROM pastes WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (!row) return res.send("Paste not found");
      res.send(`<pre>${row.content}</pre>`);
    }
  );
});

// ---- START SERVER ----
app.listen(3000, () => {
  console.log("Project running at http://localhost:3000");
});
