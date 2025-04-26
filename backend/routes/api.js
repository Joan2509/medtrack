const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple authentication middleware (mock for simplicity)
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader === 'Bearer 123') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Log actions for audit trail
const logAction = (action, details) => {
    db.run(
        'INSERT INTO audit_logs (action, details, timestamp) VALUES (?, ?, ?)',
        [action, details, new Date().toISOString()],
        (err) => { if (err) console.error('Audit log error:', err); }
    );
};

// 1. Create a health program
router.post('/programs', authenticate, (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Program name is required' });

    db.run(
        'INSERT INTO programs (name, description) VALUES (?, ?)',
        [name, description],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to create program' });
            logAction('CREATE_PROGRAM', `Program: ${name}`);
            res.status(201).json({ id: this.lastID, name, description });
        }
    );
});

// 2. Register a new client
router.post('/clients', authenticate, (req, res) => {
    const { name, dateOfBirth, gender, contact } = req.body;
    if (!name || !dateOfBirth) {
        return res.status(400).json({ error: 'Name and date of birth are required' });
    }

    db.run(
        'INSERT INTO clients (name, dateOfBirth, gender, contact) VALUES (?, ?, ?, ?)',
        [name, dateOfBirth, gender, contact],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to register client' });
            logAction('REGISTER_CLIENT', `Client: ${name}`);
            res.status(201).json({ id: this.lastID, name, dateOfBirth, gender, contact });
        }
    );
});

// 3. Enroll a client in a program
router.post('/clients/:clientId/enroll', authenticate, (req, res) => {
    const { clientId } = req.params;
    const { programId } = req.body;

    db.get('SELECT * FROM clients WHERE id = ?', [clientId], (err, client) => {
        if (err || !client) return res.status(404).json({ error: 'Client not found' });

        db.get('SELECT * FROM programs WHERE id = ?', [programId], (err, program) => {
            if (err || !program) return res.status(404).json({ error: 'Program not found' });

            db.run(
                'INSERT OR IGNORE INTO enrollments (clientId, programId) VALUES (?, ?)',
                [clientId, programId],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Failed to enroll client' });
                    logAction('ENROLL_CLIENT', `Client ${client.name} in program ${program.name}`);
                    res.json({ message: 'Client enrolled successfully' });
                }
            );
        });
    });
});

// 4. Search for a client
router.get('/clients/search', authenticate, (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Search query is required' });

    db.all(
        'SELECT * FROM clients WHERE name LIKE ? OR contact LIKE ?',
        [`%${query}%`, `%${query}%`],
        (err, clients) => {
            if (err) return res.status(500).json({ error: 'Search failed' });
            res.json(clients);
        }
    );
});

// 5 & 6. View client profile (exposed via API)
router.get('/clients/:clientId', authenticate, (req, res) => {
    const { clientId } = req.params;

    db.get('SELECT * FROM clients WHERE id = ?', [clientId], (err, client) => {
        if (err || !client) return res.status(404).json({ error: 'Client not found' });

        db.all(
            'SELECT p.* FROM programs p JOIN enrollments e ON p.id = e.programId WHERE e.clientId = ?',
            [clientId],
            (err, programs) => {
                if (err) return res.status(500).json({ error: 'Failed to fetch programs' });
                logAction('VIEW_PROFILE', `Client: ${client.name}`);
                res.json({ ...client, programs });
            }
        );
    });
});

module.exports = router;