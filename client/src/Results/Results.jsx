import React, { useContext } from "react";

import { GameContext } from "../GameProvider";
import { useGameScores } from "../hooks";
import { queryClient } from "..";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const {
    gameId,
    isMod,
    currentScenario,
    scenarios,
    players,
    loading,
    sendMessage,
  } = useContext(GameContext);

  const { data: scores, isLoading } = useGameScores(gameId);

  if (isLoading || loading || !players) return <p>Loading...</p>;

  const totals = players.map((player) => ({
    ...player,
    score: scores.reduce((acc, score) => acc + score[player.id], 0),
  }));

  const endRound = () => {
    sendMessage(JSON.stringify({ type: "endRound", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/music`);
  };

  return (
    <div>
      <p>Results</p>
      <p>Points earned this round:</p>
      <ul>
        {Object.entries(scores[currentScenario]).map(([playerId, score]) => (
          <li key={playerId}>
            {players.find((player) => player.id === playerId).name}: {score}
          </li>
        ))}
      </ul>
      <br />
      <p>Current Totals</p>
      <ul>
        {totals.map((player) =>
          player.isMod ? null : (
            <li key={player.playerId}>
              {player.name}: {player.score}
            </li>
          )
        )}
      </ul>
      {isMod && parseInt(currentScenario) < scenarios.length - 1 && (
        <button onClick={endRound}>End Round</button>
      )}
      {parseInt(currentScenario) === scenarios.length - 1 && <p>Game Over</p>}
    </div>
  );
};

export default Results;
