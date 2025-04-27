const express = require('express');
const apiRoutes = require('./routes/api');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('../frontend'));

// Add route to get all programs (needed for the UI)
const db = require('./db');
app.get('/api/programs', (req, res) => {
    // Authentication check
    const authHeader = req.headers['authorization'];
    if (authHeader !== 'Bearer 123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    db.all('SELECT * FROM programs', (err, programs) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve programs' });
        res.json(programs);
    });
});

// Use API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});