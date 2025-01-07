import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "../axios";

import { GameContext } from "../GameProvider";

const CreateGame = () => {
  const navigate = useNavigate();
  const { setGameCookie } = useContext(GameContext);

  const { mutate: createGame } = useMutation(() => {
    axios.post("/games").then(({ data: { gameId, modId } }) => {
      setGameCookie({ gameId, isMod: true, playerId: modId });
      navigate(`/game/${gameId}`);
    });
  });

  return (
    <div>
      <h1>Scenes and Songs</h1>
      <div>
        <button onClick={() => createGame()}>Start New Game</button>
      </div>
    </div>
  );
};

export default CreateGame;
