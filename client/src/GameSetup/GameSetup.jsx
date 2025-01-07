import React from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import CreateScenarios from "./CreateScenarios";
import PlayerJoin from "./PlayerJoin";

const GameSetup = () => {
  const { id: gameId } = useParams();
  const [cookies] = useCookies(["sns-game"]);
  const cookie = cookies["sns-game"];

  return (
    <div>
      <h1>Scenes and Songs</h1>
      <p>
        Game Link: <a href={`http://localhost:3000/game/${gameId}`}>{gameId}</a>
      </p>
      {cookie && cookie.isMod && <CreateScenarios />}
      {cookie && !cookie.isMod && <p>Player waiting for scenarios</p>}
      {!cookie && <PlayerJoin gameId={gameId} />}
    </div>
  );
};

export default GameSetup;
