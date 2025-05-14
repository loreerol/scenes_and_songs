import React, { useState, useContext } from "react";

import { GameContext } from "../../GameProvider";
import { usePlayerJoinMutation } from "../../hooks";
import { queryClient } from "../..";

const PlayerJoin = ({ gameId }) => {
  const { setGameCookie } = useContext(GameContext);
  const [name, setName] = useState("");

  const { mutate: playerJoin } = usePlayerJoinMutation(gameId, {
    onSuccess: ({ playerId }) => {
      setGameCookie({ gameId, isMod: false, playerId });
      queryClient.invalidateQueries(["players"]);
      queryClient.invalidateQueries(["gameState", gameId]);
    },
  });

  const onNameInput = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="relative grid gap-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          playerJoin({ name });
        }}
      >
        <div className="flex flex-col items-center gap-4 bg-white p-6 border-4 border-purple-400 rounded-xl shadow-md">
          <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
            Welcome
          </h2>
          <h3>Scenes and Songs is a game.. blah blah blah</h3>

          <label className="flex flex-col text-lg font-medium text-purple-700 w-full">
            To get started, please enter your name:
            <input
              name="name"
              value={name}
              onInput={onNameInput}
              className="mt-2 px-4 py-2 text-gray-900 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              placeholder="Enter your name"
            />
          </label>
        </div>
        <div className="flex mt-5 flex-col items-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-lg font-bold text-white py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Join Game 🎮
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerJoin;
