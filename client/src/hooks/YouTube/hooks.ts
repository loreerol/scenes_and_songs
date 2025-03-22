import { useQuery } from "react-query";
import { fetchVideoTitle, fetchVideoTitles } from "./services";
import { videoQueryKeys } from "./queryKeys";

export const useVideoTitle = (videoId, options = {}) => {
  return useQuery(
    videoQueryKeys.title(videoId),
    () => fetchVideoTitle(videoId),
    {
      enabled: !!videoId,
      ...options,
    },
  );
};

export const useVideoTitles = (scenarioSongs, options = {}) => {
  return useQuery(
    videoQueryKeys.multipleTitles(scenarioSongs),
    () => fetchVideoTitles(scenarioSongs),
    {
      enabled: scenarioSongs.length > 0,
      ...options,
    },
  );
};
