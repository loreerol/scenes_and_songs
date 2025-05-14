import React from "react";
import ScenarioCard from "../common/ScenarioCard";

const Scenarios = ({ edit, scenarios, setScenarios, setError }) => {
  const addScenario = () => {
    setScenarios([...scenarios, ""]);
  };

  const removeScenario = (index) => {
    if (scenarios.length > 1) {
      const newScenarios = [...scenarios];
      newScenarios.splice(index, 1);
      setScenarios(newScenarios);
    } else {
      setError("You must have at least one scenario.");
    }
  };

  const onScenarioInput = (e, i) => {
    const newScenarios = [...scenarios];
    newScenarios[i] = e.target.value;
    setScenarios(newScenarios);
  };

  return (
    <div className="grid gap-8">
      {scenarios.map((scenario, i) => (
        <div key={i} className="relative">
          <ScenarioCard
            index={i}
            value={scenario}
            onInputChange={(e) => onScenarioInput(e, i)}
            placeholder={`Enter something fun for Scenario ${i + 1}!`}
            edit={edit}
            responseInput={undefined}
          />
          {edit && (
            <button
              type="button"
              onClick={() => removeScenario(i)}
              className="absolute -top-2 -right-3 bg-purple-400 text-white font-bold py-1 px-2.5 rounded-full hover:bg-red-600"
            >
              ✖
            </button>
          )}
        </div>
      ))}
      {edit && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addScenario}
            className="flex items-center justify-center bg-purple-400 text-white font-extrabold text-3xl w-12 h-12 rounded-full shadow-lg hover:bg-purple-500 transform hover:scale-110 transition duration-200"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
