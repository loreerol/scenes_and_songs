import React, { useContext } from "react";
import { GameContext } from "../GameProvider";

const MusicPhase = () => {
  const { isMod, loading, currentScenario, scenarios, songs } =
    useContext(GameContext);

  const goToVoting = () => {
    console.info("go to voting!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p>MusicPhase</p>
      {isMod ? (
        <>
          <p>Scenario: "{scenarios[currentScenario]}"</p>
          <p>
            Songs:{" "}
            {Object.entries(songs).map(
              ([playerId, songs]) => songs[currentScenario].song
            )}
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
