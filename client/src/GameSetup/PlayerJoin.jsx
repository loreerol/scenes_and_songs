import React, { useState, useContext } from "react";
import { useMutation } from "react-query";

import axios from "../axios";
import { GameContext } from "../GameProvider";

const PlayerJoin = ({ gameId }) => {
  const { setGameCookie } = useContext(GameContext);
  const [name, setName] = useState("");

  const { mutate: playerJoin } = useMutation(() => {
    axios
      .post(`/games/${gameId}/players`, { name })
      .then(({ data: { playerId } }) => {
        setGameCookie({ gameId, isMod: false, playerId });
      });
  });

  const onNameInput = (e) => {
    setName(e.target.value);
  };

  return (
    <form action={() => playerJoin()}>
      <label>
        Name: <input name="name" value={name} onInput={onNameInput} />
      </label>
      <br />
      <br />
      <button type="submit">Join Game</button>
    </form>
  );
};

export default PlayerJoin;
