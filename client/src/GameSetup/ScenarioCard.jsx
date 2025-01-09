import React from "react";

const ScenarioCard = ({
  index,
  value,
  onInputChange,
  placeholder,
  edit,
  responseInput,
}) => {
  return (
    <div
      className={`relative ${
        responseInput
          ? "relative border-4 border-purple-400 rounded-xl p-4 text-gray-900 bg-white shadow-md"
          : ""
      }`}
    >
      <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
        🎭 Scenario {Number(index) + 1}
      </h2>
      <textarea
        name={`scenario-${index}`}
        value={value}
        onInput={onInputChange}
        className={`w-full font-extrabold text-3xl rounded-xl p-4 pt-10 text-center text-purple-900 bg-white focus:outline-none focus:ring-4 focus:ring-purple-500 placeholder-purple-400 ${
          responseInput ? "border-0" : "border-4 border-purple-400"
        } ${!edit ? " leading-tight resize-none cursor-default " : ""}`}
        style={{ height: edit ? "auto" : "auto" }}
        placeholder={placeholder}
        disabled={!edit}
      />
      {responseInput && (
        <div className="mt-4">
          <label className="block text-lg font-medium text-purple-700">
            {responseInput.label}
            <input
              type={responseInput.type || "text"}
              name={responseInput.name || `response-${index}`}
              value={responseInput.value}
              onInput={(e) => responseInput.onChange(e, index)}
              className="mt-2 w-full px-4 py-2 text-gray-900 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              placeholder={responseInput.placeholder}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ScenarioCard;
