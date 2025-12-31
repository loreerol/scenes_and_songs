import React, { useState } from "react";
import YouTube from "react-youtube";
import { useVideoTitle } from "../../hooks";
import useYouTubePlayer from "./utils";
import { extractVideoId } from "../../utils/youtube";
import { logError } from "../../utils/observability";

interface AudioPlayerProps {
  videoUrl: string;
  scenario: string;
  scenarioNumber: string;
  songNumber: string;
}

const AudioPlayer = ({
  videoUrl,
  scenario,
  scenarioNumber,
  songNumber,
}: AudioPlayerProps) => {
  const videoId = extractVideoId(videoUrl, {
    domain: "audio-player",
    context: "AudioPlayer-mount",
  });
  const [playerError, setPlayerError] = useState<string | null>(null);

  const { data: videoTitle, error: titleError, isLoading } = useVideoTitle(videoId || "");

  const {
    currentTime,
    duration,
    playVideo,
    pauseVideo,
    handleSeekChange,
    onReady,
  } = useYouTubePlayer(videoId);

  const handlePlayerError = (event: { data: number }) => {
    const errorCode = event.data;
    let errorMsg = "Video player error";

    switch (errorCode) {
      case 2:
        errorMsg = "Invalid video ID - the video URL may be incorrect";
        break;
      case 5:
        errorMsg = "Video playback error - please try again";
        break;
      case 100:
        errorMsg = "Video not found - it may have been removed or made private";
        break;
      case 101:
      case 150:
        errorMsg = "Video cannot be played - it may be restricted or embedded playback disabled";
        break;
      default:
        errorMsg = "Video player error - please skip to the next song";
    }

    setPlayerError(errorMsg);

    logError("YouTube player error", {
      domain: "audio-player",
      context: "handlePlayerError",
      errorCode,
      videoId,
      videoUrl,
      issue: errorMsg,
    });
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const titleErrorMessage = titleError ? "Could not load title" : null;

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
    },
  };

  if (!videoId) {
    return (
      <div className="relative border-4 border-red-400 rounded-xl p-6 bg-red-50 shadow-md">
        <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-red-400 rounded-full px-6 py-2 shadow-md">
          {`⚠️ Scenario ${scenarioNumber + 1}`}
        </h2>
        <h2 className="w-full font-extrabold text-3xl p-4 pt-10 text-center text-purple-900">
          {scenario}
        </h2>
        <h2 className="font-extrabold text-1xl pt-3 text-purple-900">
          {songNumber}
        </h2>

        <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
          <p className="text-red-700 font-bold mb-2">❌ Invalid Video URL</p>
          <p className="text-red-600 text-sm mb-2">Could not extract video ID from: {videoUrl}</p>
          <p className="text-gray-600 text-sm">Please skip to the next song or use a valid YouTube URL.</p>
        </div>
      </div>
    );
  }

  if (playerError) {
    return (
      <div className="relative border-4 border-yellow-400 rounded-xl p-6 bg-yellow-50 shadow-md">
        <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-yellow-400 rounded-full px-6 py-2 shadow-md">
          {`⚠️ Scenario ${scenarioNumber + 1}`}
        </h2>
        <h2 className="w-full font-extrabold text-3xl p-4 pt-10 text-center text-purple-900">
          {scenario}
        </h2>
        <h2 className="font-extrabold text-1xl pt-3 text-purple-900">
          {songNumber}
        </h2>

        <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
          <p className="text-yellow-800 font-bold mb-2">⚠️ Player Error</p>
          <p className="text-yellow-700 mb-2">{playerError}</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Open video in new tab →
          </a>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setPlayerError(null)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border-4 border-purple-400 rounded-xl p-6 bg-white shadow-md">
      <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
        {`🎵 Scenario ${scenarioNumber + 1}`}
      </h2>
      <h2 className="w-full font-extrabold text-3xl p-4 pt-10 text-center text-purple-900">
        {scenario}
      </h2>
      <h2 className="font-extrabold text-1xl pt-3 text-purple-900 bg-white">
        {songNumber}
      </h2>

      {isLoading && <p className="text-gray-500 italic">Loading video title...</p>}

      {titleErrorMessage && (
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700 text-sm">
            ⚠️ Could not load video title (showing URL instead)
          </p>
        </div>
      )}

      <h3 className="text-purple-900 font-bold text-lg mb-2">
        {!isLoading && !titleError && videoTitle ? videoTitle.title : videoUrl}
      </h3>

      <YouTube
        videoId={videoId || ""}
        opts={opts}
        onReady={onReady}
        onError={handlePlayerError}
      />

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
