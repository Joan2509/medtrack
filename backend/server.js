const express = require('express');
const apiRoutes = require('./routes/api');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('../frontend'));
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});