import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "./GameProvider";

const GameRedirect = () => {
  const { gameId, gameState } = useContext(GameContext);
  const navigate = useNavigate();

  if (["lobby", "song-selection"].includes(gameState)) {
    navigate(`/game/${gameId}/set-up`);
  } else if (gameState === "music-phase") {
    navigate(`/game/${gameId}/music`);
  }

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default GameRedirect;
