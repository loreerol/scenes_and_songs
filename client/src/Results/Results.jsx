import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameProvider";
import { useGameScores } from "../hooks";
import { queryClient } from "..";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

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

  const { data: scores, isLoading, isFetching } = useGameScores(gameId);

  const [totals, setTotals] = useState([]);

  useEffect(() => {
    if (!isLoading && !loading && players && scores) {
      const calculatedTotals = players.map((player) => ({
        ...player,
        score: scores
          ? scores.reduce((acc, score) => acc + (score[player.id] || 0), 0)
          : 0,
      }));
      setTotals(calculatedTotals);
    }
  }, [isLoading, loading, players, scores]);

  if (
    isLoading ||
    isFetching ||
    loading ||
    !players ||
    !scores ||
    !currentScenario ||
    !scenarios ||
    !totals.length
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold text-gray-700 animate-pulse">Loading...</p>
      </div>
    );
  }

  const maxScore = Math.max(...totals.map((player) => player.score));

  const winners = totals.filter((player) => player.score === maxScore);

  const endRound = () => {
    if (parseInt(currentScenario) === scenarios.length - 1) {
      navigate(`/game/${gameId}/game-over`);
      return;
    }

    sendMessage(JSON.stringify({ type: "endRound", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/music`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border-4 border-purple-400">
        <h1 className="text-3xl font-extrabold text-purple-600 text-center mb-4">
          🏆 Results
        </h1>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Points Earned This Round:</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(scores[currentScenario] || {}).map(
              ([playerId, score]) => {
                const player = players.find((p) => p.id === playerId);
                return (
                  <li
                    key={playerId}
                    className="px-4 py-2 bg-purple-100 rounded-lg text-purple-900 shadow"
                  >
                    {player ? `${player.name}: ${score}` : `Unknown player: ${score}`}
                  </li>
                );
              }
            )}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Current Totals:</h2>
          <ul className="mt-3 space-y-2">
            {totals.map((player) =>
              player.isMod ? null : (
                <li
                  key={player.id}
                  className="px-4 py-2 bg-purple-100 rounded-lg text-purple-900 shadow"
                >
                  {player.name}: {player.score}
                </li>
              )
            )}
          </ul>
        </div>
        {parseInt(currentScenario) === scenarios.length - 1 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-700 text-center">
              {winners.length > 1
                ? "🏅 The Winners Are:"
                : "🏅 The Winner Is:"}
            </h2>
            <p className="text-xl text-gray-800 text-center mt-2">
              {winners.map((winner) => winner.name).join(", ")}
            </p>
          </div>
        )}
        {isMod && (
          <div className="text-center mt-6">
            {parseInt(currentScenario) !== scenarios.length && (
              <button
                onClick={endRound}
                className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                End Round
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
