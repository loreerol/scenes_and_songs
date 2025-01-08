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
    content = <PlayerJoin gameId={gameId} />;
  } else if (isMod) {
    content = <ModScenarios />;
  } else {
    if (gameState === "lobby") {
      content = (
        <p className="text-xl text-yellow-200 text-center">
          🎭 Please wait for the moderator to create the scenarios...
        </p>
      );
    } else if (gameState === "song-selection") {
      content = <SongSubmition />;
    }
  }
  return <Layout>{content}</Layout>;
};

export default GameSetup;
