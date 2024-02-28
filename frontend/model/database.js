const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const cron = require('node-cron');

const app = express();

// MySQL connection pool
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Br0nzeomegalul!',
  database: 'vtuber_db', // Replace with your actual database name
  waitForConnections: true,
});

const fetchAndStoreSubCounts = async () => {
  const youTubers = [
    'Kunai Nakasato', 'Victoria Brightshield', 'Claude Clawmark', 'Yu Q. Wilson', 'Vantacrow Bringer',
    'Vezalius Bandage', 'Ver Vermillion', 'Kotoka Torahime', 'Hex Haywire', 'Meloco Kyoran', 'Doppio Dropscythe',
    'Ren Zotto', 'Scarle Yonaguni', 'Aster Arcadia', 'Aia Amare', 'Maria Marionette', 'Vox Akuma', 'Ike Eveland',
    'Shu Yamino', 'Luca Kaneshiro', 'Reimu Endou', 'Enna Alouette', 'Millie Parfait', 'Petra Gurin',
    'Rosemi Lovelock', 'Finana Ryugu', 'Elira Pendora', 'Dokibird'
  ];

  for (const vtuber of youTubers) {
    try {
      // Execute the SQL query with promise()
      const [rows] = await dbPool.promise().execute('SELECT youtubeid, channelname FROM youtubenames WHERE channelname = ?', [vtuber]);

      if (rows.length > 0) {
        const youtuberId = rows[0].youtubeid;
        const youtuberName = rows[0].name;

        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'statistics',
            id: youtuberId,
            key: 'AIzaSyD6GYnOCkc0GN1T5nx3RYQCGZ0ulfpvnoo', // Replace with your API key
          },
        });

        const subCount = response.data.items[0].statistics.subscriberCount;
        console.log(subCount);
        const timestamp = new Date();

        // Update existing row in the youtubenames table
        await dbPool.promise().execute('UPDATE youtubenames SET currentsubcount = ? WHERE channelname = ?', [subCount, vtuber]);

        // Insert data into the subcounthistory table
        await dbPool.promise().execute('INSERT INTO subcounthistory (yt_id, subCount, timestamp) VALUES (?, ?, ?)', [youtuberId, subCount, timestamp]);

        console.log(`Successfully fetched and stored data for ${vtuber}`);
      } else {
        console.error(`YouTuber ${vtuber} not found in the youtubenames table`);
      }
    } catch (error) {
      console.error(`Error fetching or updating data for ${vtuber}:`, error.message);
    }
  }
};

// Schedule the task to run daily at 4:00 PM
cron.schedule('0 17 * * *', fetchAndStoreSubCounts);

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});