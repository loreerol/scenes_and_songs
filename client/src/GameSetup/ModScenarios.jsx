import React, { useContext, useState } from "react";
import { useMutation } from "react-query";

import axios from "../axios";
import { GameContext } from "../GameProvider";
import { queryClient } from "../index";

import Scenarios from "./Scenarios";
import { useNavigate } from "react-router-dom";

const ModScenarios = () => {
  const navigate = useNavigate();
  const {
    gameId,
    gameState,
    loading,
    scenarios: scenariosData,
    sendMessage,
  } = useContext(GameContext);
  const [scenarios, setScenarios] = useState(
    scenariosData || Array(3).fill("")
  );
  const [error, setError] = useState();

  const { mutate: postScenarios } = useMutation(
    () =>
      axios.post(`/games/${gameId}/scenarios`, { scenarios }).catch((err) => {
        const res = err.response;
        if (res?.status === 400) setError(res.data.message);
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["gameState"]);
      },
    }
  );

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
    postScenarios();
  };

  const startGame = () => {
    sendMessage(JSON.stringify({ type: "start-game", gameId }));
    navigate(`/game/${gameId}/music`);
  };

  if (loading) {
    return <p className="text-xl text-gray-600 text-center">Loading...</p>;
  }

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
      {scenariosSubmitted && <button
          onClick={startGame}
          className={"text-3xl font-extrabold rounded-full shadow-lg px-3 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white"}
        >
          Start Game
        </button>}
    </div>
  );
};

export default ModScenarios;
