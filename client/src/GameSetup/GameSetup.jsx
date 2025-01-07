import React, { useContext } from "react";

import { GameContext } from "../GameProvider";
import CreateScenarios from "./CreateScenarios";
import PlayerJoin from "./PlayerJoin";

const GameSetup = () => {
  const { gameId, playerId, playerName, isMod } = useContext(GameContext);
  console.info("GameSetup", { gameId, playerId, playerName, isMod });

  return (
    <div>
      <h1>Scenes and Songs</h1>
      <p>
        Game Link: <a href={`http://localhost:3000/game/${gameId}`}>{gameId}</a>
      </p>
      {playerId && isMod && <CreateScenarios />}
      {playerId && !isMod && (
        <p>
          Player <b>{playerName}</b> waiting for scenarios
        </p>
      )}
      {!playerId && <PlayerJoin gameId={gameId} />}
    </div>
  );
};

export default GameSetup;
