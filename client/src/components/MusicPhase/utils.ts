import { useState, useEffect, useRef, useCallback } from "react";
import { YouTubePlayer } from "react-youtube";

const useYouTubePlayer = (videoId: string | null) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(0);

  const onReady = (event: { target: YouTubePlayer }) => {
    if (!videoId) return;
    playerRef.current = event.target;
    setDuration(playerRef.current.getDuration());
  };

  const playVideo = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pauseVideo = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime, true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    playerRef,
    currentTime,
    duration,
    playVideo,
    pauseVideo,
    handleSeekChange,
    onReady,
  };
};

export default useYouTubePlayer;
