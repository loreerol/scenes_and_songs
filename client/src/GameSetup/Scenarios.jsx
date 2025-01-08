import React, { useRef } from "react";

const Scenarios = ({ edit, scenarios, setScenarios, setError }) => {
  const textareaRefs = useRef([]);

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
          <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
            🎭 Scenario {i + 1}
          </h2>
          <textarea
            ref={(el) => (textareaRefs.current[i] = el)} 
            name={`scenario-${i}`}
            value={scenario}
            onInput={(e) => onScenarioInput(e, i)}
            className={`w-full text-lg border-4 border-purple-400 rounded-xl p-4 text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-purple-500 placeholder-purple-400 ${
              !edit ? " leading-tight resize-none cursor-default "  : ""
            }`}
            style={
              !edit
                ? {
                    paddingBottom: "0",
                    lineHeight: "1", 
                    height: "auto", 
                  }
                : {}
            }
            placeholder={`Enter something fun for Scenario ${i + 1}!`}
            disabled={!edit}
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
