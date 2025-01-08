import { generateId } from "../utils.js";

const getPlayer = async (req, res, client) => {
  const gameId = req.params.gameId;
  const playerId = req.params.playerId;

  let player = await client.hGetAll(`sns:${gameId}:player:${playerId}`);
  if (!player) {
    const mod = await client.hGet(`sns:${gameId}`, "mod");
    if (playerId === mod) {
      player = { name: "Mod", isMod: true };
    } else {
      res.status(404).json({ message: "Player not found" });
      return;
    }
  }
  res.json(player);
};

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
    method: "get",
    path: "/api/games/:gameId/players/:playerId",
    handler: getPlayer,
  },
  {
    method: "post",
    path: "/api/games/:gameId/players",
    handler: playerJoin,
  },
];
