/**
 * Posts content to TikTok using user's OAuth tokens
 * Note: TikTok is a video-only platform. 
 * @param {Object} account - The SocialAccount mongoose document
 * @param {String} content - The text/caption content of the post
 * @param {Array} media - Array of media objects (must contain at least one video)
 * @returns {String} - The ID of the published post/job
 */
const postToTikTok = async (account, content, media) => {
  // Validate that a video is provided
  const videoMedia = media && media.find(m => m.type === 'video');
  if (!videoMedia) {
    throw new Error('TikTok is a video platform and requires at least one video media file attached.');
  }

  const url = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
  const body = {
    post_info: {
      title: content.substring(0, 150), // TikTok title limit
      privacy_level: 'PUBLIC_TO_EVERYONE',
      disable_comment: false,
      disable_duet: false,
      disable_stitch: false,
      video_cover_timestamp_ms: 1000
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: 1024 * 1024 * 10, // Mock video size
      chunk_size: 1024 * 1024 * 10,
      total_chunk_count: 1
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error('TikTok API Error:', data.error);
    throw new Error(data.error?.message || data.error?.description || `TikTok API error (Status ${response.status})`);
  }

  return data.data?.publish_id || 'tiktok-publish-initiated';
};

module.exports = {
  postToTikTok
};
