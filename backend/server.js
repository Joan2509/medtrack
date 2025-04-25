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

  // Enroll a client in a program
app.post('/api/clients/:clientId/enroll', (req, res) => {
    const { programId } = req.body;
    const clientId = req.params.clientId;
    db.get(`SELECT id FROM clients WHERE clientId = ?`, [clientId], (err, client) => {
      if (err || !client) return res.status(400).json({ error: 'Client not found' });
      db.get(`SELECT id FROM programs WHERE id = ?`, [programId], (err, program) => {
        if (err || !program) return res.status(400).json({ error: 'Program not found' });
        db.run(`INSERT INTO client_programs (clientId, programId) VALUES (?, ?)`, [client.id, programId], (err) => {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ message: 'Client enrolled' });
        });
      });
    });
  });

  // View client profile
app.get('/api/clients/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    db.get(
      `SELECT c.name, c.clientId, GROUP_CONCAT(p.name) as programs
       FROM clients c
       LEFT JOIN client_programs cp ON c.id = cp.clientId
       LEFT JOIN programs p ON cp.programId = p.id
       WHERE c.clientId = ?
       GROUP BY c.id`,
      [clientId],
      (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Client not found' });
        res.json({
          name: row.name,
          clientId: row.clientId,
          programs: row.programs ? row.programs.split(',') : []
        });
      }
    );
  });