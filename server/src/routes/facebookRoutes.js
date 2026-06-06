const express = require('express');
const axios = require('axios');
const { publishFacebookPost } = require('../services/facebookService');

const router = express.Router();

router.post('/post', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: "Message is required." 
      });
    }

    const result = await publishFacebookPost(message);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in Facebook post route:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error." 
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !ACCESS_TOKEN) {
      return res.status(500).json({
        success: false,
        error: "Missing Facebook credentials in environment variables."
      });
    }

    const response = await axios.get(
      `https://graph.facebook.com/v23.0/${PAGE_ID}`,
      {
        params: {
          fields: 'id,name',
          access_token: ACCESS_TOKEN
        }
      }
    );

    res.json({
      success: true,
      page: response.data
    });
  } catch (err) {
    console.error("Error in Facebook status route:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data?.error?.message || err.response?.data || err.message
    });
  }
});

module.exports = router;
