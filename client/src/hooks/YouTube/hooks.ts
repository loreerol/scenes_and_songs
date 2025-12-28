import { useQuery } from "@tanstack/react-query";
import { fetchVideoTitle, fetchVideoTitles } from "./services";
import { videoQueryKeys } from "./queryKeys";
import { VideoTitle } from "../../types/gameTypes";

export const useVideoTitle = (videoId: string, options = {}) => {
  return useQuery<VideoTitle>({
    queryKey: videoQueryKeys.title(videoId),
    queryFn: () => fetchVideoTitle(videoId),
    enabled: !!videoId,
    ...options,
  });
};

export const useVideoTitles = (scenarioSongs: any[], options = {}) => {
  return useQuery<VideoTitle[]>({
    queryKey: videoQueryKeys.multipleTitles(scenarioSongs),
    queryFn: () => fetchVideoTitles(scenarioSongs),
    enabled: scenarioSongs.length > 0,
    ...options,
  });
};
