import React from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import axios from "../axios";

const CreateGame = () => {
  const navigate = useNavigate();
  const [_, setCookie] = useCookies(["sns-game"]);

  const { mutate: createGame } = useMutation(() => {
    axios.post("/games").then(({ data: { gameId, modId } }) => {
      setCookie("sns-game", { gameId, isMod: true, playerId: modId });
      navigate(`/game/${gameId}`);
    });
  });

  console.info("CreateGame");

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
