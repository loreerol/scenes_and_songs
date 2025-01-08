import React, { useContext, useState } from "react";
import { GameContext } from "../GameProvider";
import Scenarios from "./Scenarios";
import axios from "../axios";
import { useMutation, useQueryClient } from "react-query";
import Wavey from "../CreateGame/Wavey";

const ModScenarios = () => {
  const { scenariosData, gameId } = useContext(GameContext);

  // temporarily hard-coded
  const waitingForUserData = true;

  const [scenarios, setScenarios] = useState(Array(3).fill(""));
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
        queryClient.invalidateQueries(["scenarios", gameId]);
      },
    }
  );

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

  if (!scenariosData) {
    return <p className="text-xl text-gray-600 text-center">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-4xl font-extrabold text-yellow-300 text-center mb-12">
        {scenariosData.exists ? "Scenarios Created" : "Create Scenarios"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitScenarios();
        }}
        className="space-y-12 text-center"
      >
        <Scenarios
          edit={!scenariosData.exists}
          scenarios={scenariosData.exists ? scenariosData.scenarios : scenarios}
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
          disabled={scenariosData.exists}
          className={`text-3xl font-extrabold rounded-full shadow-lg px-3 py-2 ${
            scenariosData.exists
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white"
          }`}
        >
          {scenariosData.exists ? "✔ Submitted" : "Submit"}
        </button>
        {scenariosData.exists ? (
          waitingForUserData ? (
            <Wavey text={"Waiting for user responses ..."} />
          ) : (
            <p>Users ready: Lore, Hristina</p>
          )
        ) : null}
      </form>
    </div>
  );
};

export default ModScenarios;
