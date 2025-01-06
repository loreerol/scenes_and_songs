import React from "react";
import { useMutation } from "react-query";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const CreateGame = () => {
  const { mutate: createGame } = useMutation(() => {
    instance.post("/create-game").then((response) => {
      console.log(response.data);
    });
  });

  console.info("CreateGame");

  return (
    <div>
      <h1>Scenes and Songs</h1>
      <div>
        <button onClick={() => createGame()}>Click me!</button>
      </div>
    </div>
  );
};

export default CreateGame;
