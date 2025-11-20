import axios from "axios";

export const createRootValue = () => ({
    // YouTube Query
    youtubeVideo: async ({ videoId }) => {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
                params: {
                    part: "snippet",
                    id: videoId,
                    key: process.env.YOUTUBE_API_KEY,
                },
            }
        );

        const video = response.data.items[0];
        if (!video) {
            throw new Error("Video not found");
        }

        return {
            id: videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url,
        };
    }
})