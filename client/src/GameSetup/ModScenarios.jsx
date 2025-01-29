import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScenariosMutation, useRandomSongOrderMutation } from "../hooks";

import { GameContext } from "../GameProvider";
import { queryClient } from "../index";

import Scenarios from "./Scenarios";

const ModScenarios = () => {
  const navigate = useNavigate();
  const {
    gameId,
    gameState,
    songs,
    players,
    loading,
    scenarios: scenariosData,
    sendMessage,
  } = useContext(GameContext);
  const [scenarios, setScenarios] = useState(
    scenariosData || Array(3).fill("")
  );
  const [error, setError] = useState();

  const { mutate: postScenarios } = useScenariosMutation(gameId, {
    onError: (err) => {
      const res = err.response;
      if (res?.status === 400) setError(res.data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gameState"]);
    },
  });

  const { mutate: generateRandomOrder } = useRandomSongOrderMutation(gameId, {
    onError: (err) => {
      const res = err.response;
      if (res?.status === 400) setError(res.data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gameState"]);
    },
  });

  const scenariosSubmitted = gameState === "song-selection";

  const submitScenarios = () => {
    if (scenarios.some((scenario) => scenario === "")) {
      setError("Please fill out all scenarios");
      return;
    }
    if (scenarios.length !== new Set(scenarios).size) {
      setError("Scenarios must be unique");
      return;
    }
    setError(undefined);
    postScenarios({ scenarios });
  };

  const startGame = () => {
    sendMessage(JSON.stringify({ type: "startGame", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    queryClient.invalidateQueries(["songs"]);
    queryClient.invalidateQueries(["players"]);
    generateRandomOrder();
    navigate(`/game/${gameId}/music`);
  };

  if (loading) {
    return <p className="text-xl text-gray-600 text-center">Loading...</p>;
  }

  const playersReady = Object.values(songs || []).filter(
    (submission) => submission.filter((s) => "song" in s).length
  ).length;
  const totalPlayers = players.filter(({ isMod }) => !isMod).length;
  const readyStateMessage = `${playersReady}/${totalPlayers} players are ready.`;

  return (
    <div>
      <h2 className="text-4xl font-extrabold text-yellow-300 text-center mb-12">
        {gameState === "song-selection"
          ? "Scenarios Created"
          : "Create Scenarios"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitScenarios();
        }}
        className="space-y-12 text-center"
      >
        <Scenarios
          edit={!scenariosSubmitted}
          scenarios={scenarios}
          setScenarios={setScenarios}
          setError={setError}
        />

        {error && (
          <p className="text-pink-500 text-xl font-bold animate-bounce">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={scenariosSubmitted}
          className={`text-3xl font-extrabold rounded-full shadow-lg px-3 py-2 ${
            scenariosSubmitted
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white"
          }`}
        >
          {scenariosSubmitted ? "✔ Submitted" : "Submit"}
        </button>
      </form>
      {scenariosSubmitted && (
        <div className="flex flex-col items-center py-6">
          <p className="text-white py-6 font-bold">{readyStateMessage}</p>
          <button
            onClick={startGame}
            className="text-3xl px-8 font-extrabold rounded-full shadow-lg px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default ModScenarios;
