import React, { useContext } from "react";
import Layout from "../Layout";
import { GameContext } from "../GameProvider";
import ModScenarios from "./ModScenarios";
import PlayerJoin from "./PlayerJoin";

const GameSetup = () => {
  const { gameId, playerId, playerName, isMod } = useContext(GameContext);

  return (
    <Layout>
      {playerId && isMod && (
          <ModScenarios />
      )}
      {playerId && !isMod && (
        <p className="text-xl text-gray-600 text-center">
          🎭 Player <b className="text-purple-700">{playerName}</b> is waiting
          for the moderator to create scenarios...
        </p>
      )}
      {!playerId && (
        <div>
          <h2 className="text-3xl font-semibold text-purple-700 mb-4 text-center">
            Join the Game
          </h2>
          <PlayerJoin gameId={gameId} />
        </div>
      )}
    </Layout>
  );
};

export default GameSetup;
