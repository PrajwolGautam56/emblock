 
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

 app.get('/api/tesla-news', async (req, res) => {
  const newsApiUrl = 'https://newsapi.org/v2/everything';
  const apiKey = process.env.NEWS_API_KEY || 'b4d69a3179d04ceb88066a96a60e06f8';  
  try {
    const response = await axios.get(newsApiUrl, {
      params: {
        q: 'tesla',
        from: '2024-10-26',
        sortBy: 'publishedAt',
        apiKey: apiKey,
      },
    });

    // Return raw API response
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch Tesla news' });
  }
});

 const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
 