import { generateId, currentTimeString } from "./utils.js";

const createGame = async (req, res, client) => {
  let gameId = generateId();
  while (await client.get(`sns:${gameId}`)) gameId = generateId();
  const modId = generateId();

  await client.hSet(`sns:${gameId}`, {
    mod: modId,
    start: currentTimeString(),
  });

  res.json({ gameId, modId });
};

export default [
  {
    method: "post",
    path: "/api/games",
    handler: createGame,
  },
];
