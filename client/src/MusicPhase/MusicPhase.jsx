import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

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
    sendMessage,
  } = useContext(GameContext);

  const goToVoting = () => {
    sendMessage(JSON.stringify({ type: "startVoting", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/vote`);
  };

  if (loading || typeof currentScenario === "undefined")
    return <p>Loading...</p>;

  return (
    <div>
      <p>MusicPhase</p>
      {isMod ? (
        <>
          <p>Scenario: "{scenarios[currentScenario]}"</p>
          <p>
            Songs:{" "}
            {Object.entries(songs)
              .map(([_, songs]) => songs[currentScenario].song)
              .join(", ")}
          </p>
          <button onClick={goToVoting}>Go To Voting</button>
        </>
      ) : (
        <p>Scenario: "{scenarios[currentScenario]}"</p>
      )}
    </div>
  );
};

export default MusicPhase;
