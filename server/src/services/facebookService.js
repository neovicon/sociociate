const axios = require('axios');

async function publishFacebookPost(message) {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return {
      success: false,
      error: "Missing Facebook credentials in environment variables."
    };
  }

  try {
    const params = new URLSearchParams({
      message,
      access_token: ACCESS_TOKEN
    });

    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${PAGE_ID}/feed`,
      params
    );

    return {
      success: true,
      postId: response.data.id
    };
  } catch (error) {
    console.error("Error publishing to Facebook:", error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.error?.message || "Failed to publish post to Facebook."
    };
  }
}

module.exports = {
  publishFacebookPost
};
