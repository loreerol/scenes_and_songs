import { logWarning } from "./observability";

export const extractVideoId = (
  url: string | undefined,
  context: { domain: string; context: string }
): string => {
  if (!url) return "";

  // Try to extract video ID from various YouTube URL formats
  const match = url.match(/(?:v=|\/|embed\/|youtu\.be\/)([0-9A-Za-z_-]{11})/);
  const videoId = match?.[1];

  // log if URL exists but is malformed
  if (!videoId && url.length > 0) {
    logWarning("Invalid YouTube URL format", {
      ...context,
      url, 
      issue: "Could not extract video ID from URL",
    });
  }

  return videoId || "";
};

export const isValidYouTubeUrl = (url: string | undefined): boolean => {
  if (!url) return false;

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([0-9A-Za-z_-]{11})/;
  return youtubeRegex.test(url);
};

export const formatYouTubeUrl = (url: string): string => {
  if (url.startsWith("http")) {
    return url;
  }

  // If it's just a video ID, format it as a watch URL
  return `https://www.youtube.com/watch?v=${url}`;
};

export const getEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};
