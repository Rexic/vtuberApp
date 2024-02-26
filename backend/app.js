const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Serve HTML files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/view')));
// Serve JavaScript files from the 'backend' directory
app.use('/backend', express.static(path.join(__dirname, 'backend')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});