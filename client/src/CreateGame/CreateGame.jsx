import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateGameMutation } from "../hooks";
import Layout from "../Layout";
import { GameContext } from "../GameProvider";

const CreateGame = () => {
  const navigate = useNavigate();
  const { setGameCookie } = useContext(GameContext);

  const { mutate: createGame } = useCreateGameMutation({
    onSuccess: ({ gameId, modId }) => {
      setGameCookie({ gameId, isMod: true, playerId: modId });
      navigate(`/game/${gameId}`);
    },
  });

  return (
    <Layout>
      <div className="space-y-12 text-center grid gap-8">
        <div className="relative grid gap-8">
          <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
            Welcome
          </h2>
          <textarea
            value={"Scenes and Songs is a game.. blah blah blah"}
            className={
              "w-full text-lg font-extrabold text-purple-900 border-4 border-purple-400 rounded-xl p-4 text-gray-900 bg-white focus:outline-none focus:ring-5 focus:ring-purple-500 placeholder-purple-400 cursor-default resize-none"
            }
            disabled
          />
          <div className="flex flex-col items-center">
            <button
              onClick={() => createGame()}
              className=" bg-gradient-to-r  from-purple-500 via-pink-500 to-yellow-400 text-3xl font-extrabold text-white py-2 rounded-full shadow-lg px-3 py-2 "
            >
              Start New Game 🎮
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateGame;
