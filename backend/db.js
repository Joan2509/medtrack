const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('health.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            dateOfBirth TEXT NOT NULL,
            gender TEXT,
            contact TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS enrollments (
            clientId INTEGER,
            programId INTEGER,
            FOREIGN KEY(clientId) REFERENCES clients(id),
            FOREIGN KEY(programId) REFERENCES programs(id),
            PRIMARY KEY(clientId, programId)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            details TEXT,
            timestamp TEXT NOT NULL
        )
    `);
});

module.exports = db;