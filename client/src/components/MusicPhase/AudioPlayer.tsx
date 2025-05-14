import React from "react";
import YouTube from "react-youtube";
import { useVideoTitle } from "../../hooks";
import { Scenario } from "../../types/gameTypes";
import useYouTubePlayer from "./utils";

interface AudioPlayerProps {
  videoUrl: string;
  scenario: Scenario;
  scenarioNumber: string;
  songNumber: string;
}

const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

const AudioPlayer = ({
  videoUrl,
  scenario,
  scenarioNumber,
  songNumber,
}: AudioPlayerProps) => {
  const videoId = extractVideoId(videoUrl);
  const { data: videoTitle, error, isLoading } = useVideoTitle(videoId || "");
  const {
    currentTime,
    duration,
    playVideo,
    pauseVideo,
    handleSeekChange,
    onReady,
  } = useYouTubePlayer(videoId);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatError = (error: unknown): string | null => {
    if (!error) return null;
    return error instanceof Error ? error.message : String(error);
  };

  const errorMessage = formatError(error);

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="relative border-4 border-purple-400 rounded-xl p-6 bg-white shadow-md">
      <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
        {`🎵 Scenario ${scenarioNumber + 1}`}
      </h2>
      <h2 className="w-full font-extrabold text-3xl p-4 pt-10 text-center text-purple-900">
        {scenario.text}
      </h2>
      <h2 className="font-extrabold text-1xl pt-3 text-purple-900 bg-white">
        {songNumber}
      </h2>

      {isLoading && <p>Loading video title...</p>}

      {errorMessage && <p className="text-red-500">Error: {errorMessage}</p>}

      {!isLoading && !error && (
        <h3 className="text-purple-900 font-bold text-lg">{videoTitle}</h3>
      )}

      <YouTube videoId={videoId || ""} opts={opts} onReady={onReady} />

      <div className="flex flex-col items-center">
        <div className="w-full">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeekChange}
            className="w-full mt-2 appearance-none h-3 bg-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="text-sm text-gray-700 mt-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <div className="w-full flex space-x-4 justify-center mt-6">
          <button
            onClick={playVideo}
            className="px-6 py-2 bg-purple-500 text-white font-bold rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            ►
          </button>
          <button
            onClick={pauseVideo}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            ||
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
