import React, { useContext } from "react";
import { GameContext } from "../GameProvider";

const Header = () => {
  const { gameId, isMod, playerName } = useContext(GameContext);
  return (
    <>
      <header className="text-center text-white py-8">
        <h1 className="text-5xl font-extrabold tracking-widest">
          🎬 Scenes & Songs 🎵
        </h1>
        {gameId && (
          <>
            <p className="text-lg font-medium mt-2">
              Game Link:{" "}
              <a
                href={`http://localhost:3000/game/${gameId}`}
                className="text-yellow-300 underline hover:text-yellow-400 transition duration-200"
              >
                {gameId}
              </a>
            </p>
            {(playerName || isMod) && (
              <p className="text-lg font-medium mt-2">
                You are {isMod ? "the Moderator" : playerName}
              </p>
            )}
          </>
        )}
      </header>
    </>
  );
};

export default Header;
