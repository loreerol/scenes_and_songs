import React, { useContext, useState } from "react";
import { GameContext } from "../GameProvider";
import Scenarios from "./Scenarios";
import axios from "../axios";
import { useMutation, useQueryClient } from "react-query";

const ModScenarios = () => {
  const {
    gameId,
    gameState,
    loading,
    scenarios: scenariosData,
  } = useContext(GameContext);
  const [scenarios, setScenarios] = useState(
    scenariosData || Array(3).fill("")
  );
  const [error, setError] = useState();
  const queryClient = useQueryClient();

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
        {scenariosSubmitted && <button>Start Game</button>}
      </form>
    </div>
  );
};

export default ModScenarios;
