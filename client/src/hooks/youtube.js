import { useQuery } from "react-query";

const fetchVideoTitle = async (videoId) => {
  const response = await fetch(`/api/youtube?id=${videoId}`);
  if (!response.ok) {
    throw new Error("Aw shoot - Error loading song title :(");
  }
  const data = await response.json();
  if (!data.title) {
    throw new Error("Video title not found");
  }
  return data.title;
};

export const fetchVideoTitles = async (scenarioSongs) => {
  const promises = scenarioSongs.map(({ videoId }) =>
    fetch(`/api/youtube?id=${videoId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video title");
        return res.json();
      })
      .then((data) => ({ videoId, title: data.title || "Unknown Title" }))
      .catch(() => ({ videoId, title: "Error loading title" }))
  );

  return Promise.all(promises);
};

export const useVideoTitle = (videoId, options = {}) => {
  return useQuery(
    ["videoTitle", videoId], 
    () => fetchVideoTitle(videoId), 
    {
      enabled: !!videoId, 
      ...options,
    }
  );
};

