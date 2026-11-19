require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check: confirms the server is up and the database is reachable.
app.get("/api/health", (req, res) => {
  const counts = {
    users: db.prepare("SELECT COUNT(*) AS n FROM users").get().n,
    markets: db.prepare("SELECT COUNT(*) AS n FROM markets").get().n,
    predictions: db.prepare("SELECT COUNT(*) AS n FROM predictions").get().n,
  };
  res.json({ status: "ok", counts });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
