const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const dbPool = mysql.createPool({
    host: 'ls-5e1dc7d3a6323bf34ddae7818169dc448e128270.cvus6waksakp.ap-southeast-2.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: 'yz^+tk&vSHuhBpRJ3nX(Wn;=R*#PhkF$',
    database: 'vtuber_db',
    waitForConnections: true,
  });

// Serve files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/view')));

app.get('/api/fetchSubCounts', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT channelname, currentsubcount FROM youtubenames ORDER BY currentsubcount DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching subcounts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/fetchLastUpdated', async (req, res) => {
    try{
        const time = await dbPool.query('SELECT timestamp FROM subcounthistory ORDER BY timestamp LIMIT 1');
        res.json(time);
    } catch (error) {
        console.error('Error fetching time:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/api/fetchSubsOverTime', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT channelname, currentsubcount, initialsubcount, hexcolor FROM youtubenames')
        res.json(rows);
    } catch (error) {
        console.error('Error fetching subcounts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/api/fetchSubsOverTime/:channelname', async (req, res) => {
    try {
        const channelName = req.params.channelname;
        const [rows] = await dbPool.query('SELECT channelname, currentsubcount, initialsubcount, hexcolor FROM youtubenames WHERE channelname = ?', [channelName]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching subcounts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});