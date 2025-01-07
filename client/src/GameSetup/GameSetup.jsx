import React, { useContext } from "react";
import Layout from "../Layout";
import { GameContext } from "../GameProvider";
import ModScenarios from "./ModScenarios";
import PlayerJoin from "./PlayerJoin";
import SongSubmition from "./SongSubmition";

const GameSetup = () => {
  const { gameId, playerId, playerName, isMod, loading, gameState } =
    useContext(GameContext);
  console.info("GameSetup", {
    gameId,
    playerId,
    playerName,
    isMod,
    loading,
    gameState,
  });

  let content = null;

  if (loading) {
    content = <p>Loading...</p>;
  } else if (!playerId) {
    content = (
      <div>
        <h2 className="text-3xl font-semibold text-purple-700 mb-4 text-center">
          Join the Game
        </h2>
        <PlayerJoin gameId={gameId} />
      </div>
    );
  } else if (isMod) {
    content = <ModScenarios />;
  } else {
    if (gameState === "lobby") {
      content = (
        <p className="text-xl text-gray-600 text-center">
          🎭 Player <b className="text-purple-700">{playerName}</b> is waiting
          for the moderator to create scenarios...
        </p>
      );
    } else if (gameState === "song-selection") {
      content = <SongSubmition />;
    }
  }

  return <Layout>{content}</Layout>;
};

export default GameSetup;
