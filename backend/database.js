const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./health.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    clientId TEXT NOT NULL UNIQUE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS client_programs (
    clientId INTEGER,
    programId INTEGER,
    PRIMARY KEY (clientId, programId),
    FOREIGN KEY (clientId) REFERENCES clients(id),
    FOREIGN KEY (programId) REFERENCES programs(id)
  )`);
});

module.exports = db;