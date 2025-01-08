import { generateId, currentTimeString } from "../utils.js";

const getGameState = async (req, res, client) => {
  const gameId = req.params.gameId;
  const game = await client.hGetAll(`sns:${gameId}`);
  if (!game) {
    res.status(404).json({ message: "Game not found" });
    return;
  }

  res.json({ gameState: game.state, currentScenario: game.scenario });
};

const createGame = async (req, res, client, sockets) => {
  let gameId = generateId();
  while (await client.get(`sns:${gameId}`)) gameId = generateId();
  const modId = generateId();

  await client.hSet(`sns:${gameId}`, {
    mod: modId,
    start: currentTimeString(),
    state: "lobby",
  });

  sockets[gameId] = {};

  res.json({ gameId, modId });
};

export default [
  {
    method: "get",
    path: "/api/games/:gameId/state",
    handler: getGameState,
  },
  {
    method: "post",
    path: "/api/games",
    handler: createGame,
  },
];
