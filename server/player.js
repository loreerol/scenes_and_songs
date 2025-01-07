import { generateId } from "./utils.js";

const playerJoin = async (req, res, client) => {
  const gameId = req.params.gameId;
  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);

  let playerId = generateId();
  while (players.includes(playerId)) playerId = generateId();

  await client.lPush(`sns:${gameId}:players`, playerId);
  await client.hSet(`sns:${gameId}:player:${playerId}`, {
    name: req.body.name,
  });

  res.json({ playerId });
};

export default [
  {
    method: "post",
    path: "/api/games/:gameId/players",
    handler: playerJoin,
  },
];
