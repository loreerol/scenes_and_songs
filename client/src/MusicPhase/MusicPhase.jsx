import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "./AudioPlayer";
import ScenarioCard from "../GameSetup/ScenarioCard";

import { GameContext } from "../GameProvider";
import { queryClient } from "..";

const MusicPhase = () => {
  const navigate = useNavigate();
  const {
    gameId,
    isMod,
    loading,
    currentScenario,
    scenarios,
    songs,
    randomSongOrder,
    sendMessage,
  } = useContext(GameContext);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const goToVoting = () => {
    sendMessage(JSON.stringify({ type: "startVoting", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/vote`);
  };

  if (
    loading ||
    typeof currentScenario === "undefined" ||
    typeof randomSongOrder === "undefined"
  )
    return <p>Loading...</p>;

  const scenarioSongs = Object.values(songs)
    .map((songData) => songData?.[currentScenario]?.song)
    .filter(Boolean);

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex + 1 < scenarioSongs.length ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousSong = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <>
      {isMod ? (
        <>
          <div className="mb-4">
            {scenarioSongs.length > 0 &&
            scenarioSongs[
              randomSongOrder[currentScenario][currentSongIndex]
            ] ? (
              <AudioPlayer
                videoUrl={
                  scenarioSongs[
                    randomSongOrder[currentScenario][currentSongIndex]
                  ]
                }
                scenario={scenarios[currentScenario]}
                scenarioNumber={currentScenario}
                songNumber={`Song ${currentSongIndex + 1} of ${
                  scenarioSongs.length
                }`}
              />
            ) : (
              <p className="text-center text-red-500 font-bold">
                No songs available for this scenario.
              </p>
            )}
            <div className="flex justify-between justify-items-end mt-4">
              {currentSongIndex > 0 && (
                <button
                  onClick={handlePreviousSong}
                  className="px-4 py-2 bg-purple-500 text-white hover:ring-2 hover:ring-purple-500 rounded hover:bg-purple-600"
                >
                  Previous Song
                </button>
              )}
              {currentSongIndex + 1 < scenarioSongs.length && (
                <button
                  onClick={handleNextSong}
                  className="px-4 py-2 bg-blue-500 text-white over:ring-2 hover:ring-purple-500 justify-self-end rounded hover:bg-blue-600"
                >
                  Next Song
                </button>
              )}
              {currentSongIndex + 1 === scenarioSongs.length && (
                <button
                  onClick={goToVoting}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Go To Voting
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <ScenarioCard
          value={scenarios[currentScenario]}
          index={currentScenario}
        />
      )}
    </>
  );
};

export default MusicPhase;
