import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import axios from "../axios";

const PlayerJoin = ({ gameId }) => {
  const [name, setName] = useState("");

  const [_, setCookie] = useCookies(["sns-game"]);

  const { mutate: playerJoin } = useMutation(() => {
    axios
      .post(`/games/${gameId}/players`, { name })
      .then(({ data: { playerId } }) => {
        setCookie("sns-game", { gameId, isMod: false, playerId });
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
