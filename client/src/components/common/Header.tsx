import React, { useContext, useState } from "react";
import { GameContext } from "../../GameProvider";

const Header = () => {
  const { gameId, isMod, playerName } = useContext(GameContext);
  const [copied, setCopied] = useState(false);

  const copyGameLink = () => {
    const gameUrl = `http://localhost:3000/game/${gameId}`;
    navigator.clipboard
      .writeText(gameUrl)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        setCopied(false);
      });
  };

  return (
    <>
      <header className="text-center text-white py-8">
        <h1 className="text-5xl font-extrabold tracking-widest">
          🎬 Scenes & Songs 🎵
        </h1>
        {gameId && (
          <>
            <p className="text-lg font-medium mt-2 flex justify-center items-center gap-2">
              Game Link:{" "}
              <a
                href={`http://localhost:3000/game/${gameId}`}
                className="text-yellow-300 underline hover:text-yellow-400 transition duration-200"
              >
                {gameId}
              </a>
              <button
                onClick={copyGameLink}
                className="text-yellow-300"
                title="Copy game link"
              >
                📋 {copied ? "Copied!" : ""}
              </button>
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
