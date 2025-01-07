import React, { useState, useContext } from "react";
import { useMutation } from "react-query";
import { GameContext } from "../GameProvider";
import axios from "../axios";

const CreateScenarios = () => {
  const [scenarios, setScenarios] = useState(Array(3).fill(""));
  const [error, setError] = useState();
  const { gameId } = useContext(GameContext);

  const { mutate: postScenarios } = useMutation(() => {
    axios.post(`/games/${gameId}/scenarios`, { scenarios }).catch((err) => {
      const res = err.response;
      if (res?.status === 400) setError(res.data.message);
    });
  });

  const onScenarioInput = (e, i) => {
    const newScenarios = [...scenarios];
    newScenarios[i] = e.target.value;
    setScenarios(newScenarios);
  };

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

  return (
    <div>
      <p>Create Scenarios</p>
      <form action={submitScenarios}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {scenarios.map((scenario, i) => (
          <div key={i}>
            <label>
              Scenario {i + 1}:{" "}
              <textarea
                name={`scenario-${i}`}
                value={scenario}
                onInput={(e) => onScenarioInput(e, i)}
              />
            </label>
            <br />
            <br />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateScenarios;
