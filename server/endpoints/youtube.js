import axios from "axios";

const getYouTubeVideoDetails = async (req, res) => {
  const videoId = req.query.id; 
  const apiKey = process.env.YOUTUBE_API_KEY; 

  if (!videoId) {
    res.status(400).json({ error: "Video ID is required" });
    return;
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: "snippet",
          id: videoId,
          key: apiKey,
        },
      }
    );

    if (response.data.items.length === 0) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    const videoDetails = response.data.items[0].snippet; 
    res.json({ title: videoDetails.title, description: videoDetails.description });
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
};

export default [
  {
    method: "get",
    path: "/api/youtube",
    handler: getYouTubeVideoDetails,
  },
];
