const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Create a health program
app.post('/api/programs', (req, res) => {
  const { name } = req.body;
  db.run(`INSERT INTO programs (name) VALUES (?)`, [name], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
});

// Register a new client
app.post('/api/clients', (req, res) => {
    const { name, clientId } = req.body;
    db.run(`INSERT INTO clients (name, clientId) VALUES (?, ?)`, [name, clientId], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, clientId });
    });
  });