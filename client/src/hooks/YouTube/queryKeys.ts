export const videoQueryKeys = {
  title: (videoId) => ["videoTitle", videoId],
  multipleTitles: (scenarioSongs) => [
    "videoTitles",
    scenarioSongs.map((s) => s.videoId),
  ],
};
