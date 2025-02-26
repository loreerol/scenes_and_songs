import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateGameMutation } from "../hooks";
import { GameContext } from "../GameProvider";
import ContentContainer from "../common/ContentContainer";
import Button from "../common/Button";

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
    <>
      <ContentContainer title={"Welcome"} text={"blah blah blah"} />
      <div className="flex flex-col items-center">
        <Button onClick={createGame}> Start New Game 🎮 </Button>
      </div>
    </>
  );
};

export default CreateGame;
