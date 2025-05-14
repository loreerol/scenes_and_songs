import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "./GameProvider";

const GameRedirect = () => {
  const { gameId, gameState } = useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (["lobby", "song-selection"].includes(gameState)) {
      navigate(`/game/${gameId}/set-up`);
    } else if (gameState === "music-phase") {
      navigate(`/game/${gameId}/music`);
    } else if (["voting-phase", "voting-phase-results"].includes(gameState)) {
      navigate(`/game/${gameId}/vote`);
    } else if (
      ["guessing-phase", "guessing-phase-results"].includes(gameState)
    ) {
      navigate(`/game/${gameId}/guess`);
    } else if (["round-results", "game-over"].includes(gameState)) {
      navigate(`/game/${gameId}/results`);
    }
  }, [gameId, gameState, navigate]);

  return (
    <div>
      <p>This game does not exist</p>
    </div>
  );
};

export default GameRedirect;
