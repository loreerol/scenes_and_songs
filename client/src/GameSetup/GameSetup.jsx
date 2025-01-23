import React, { useContext } from "react";
import { GameContext } from "../GameProvider";
import ModScenarios from "./ModScenarios";
import PlayerJoin from "./PlayerJoin";
import SongSubmition from "./SongSubmition";

const GameSetup = () => {
  const { gameId, playerId, isMod, loading, gameState } =
    useContext(GameContext);

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;

    if (!playerId) return <PlayerJoin gameId={gameId} />;

    if (isMod) return <ModScenarios />;

    if (gameState === "lobby") {
      return (
        <p className="text-xl text-yellow-200 text-center">
          🎭 Please wait for the moderator to create the scenarios...
        </p>
      );
    }

    if (gameState === "song-selection") return <SongSubmition />;
  };

  return <>{renderContent()}</>;
};

export default GameSetup;
