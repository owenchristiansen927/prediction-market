const Database = require("better-sqlite3");
const path = require("path");

// The whole database is one file, created automatically on first run.
const db = new Database(path.join(__dirname, "market.db"));

// Enforce relationships (e.g. a prediction must belong to a real user/market).
db.pragma("foreign_keys = ON");

// CREATE TABLE IF NOT EXISTS means this is safe to run every time the server starts.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    balance       REAL NOT NULL DEFAULT 1000,
    is_admin      INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS markets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    question    TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    deadline    TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    outcome     TEXT CHECK (outcome IN ('yes', 'no')),
    creator_id  INTEGER NOT NULL REFERENCES users(id),
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    market_id  INTEGER NOT NULL REFERENCES markets(id),
    choice     TEXT NOT NULL CHECK (choice IN ('yes', 'no')),
    amount     REAL NOT NULL CHECK (amount > 0),
    shares     REAL,  -- unused for now; reserved for a possible LMSR upgrade
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
