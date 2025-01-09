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

const calculateScores = async (req, res, client) => {
  const gameId = req.params.gameId;

  const game = await client.hGetAll(`sns:${gameId}`);
  if (!["round-results", "game-over"].includes(game.state)) {
    res.status(400).json({ message: "Game or round is not over" });
    return;
  }

  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);

  const scores = [];
  for (let scenario = 0; scenario <= game.scenario; scenario++) {
    const votes = await client.hGetAll(
      `sns:${gameId}:scenario:${scenario}:votes`
    );
    const guesses = await client.hGetAll(
      `sns:${gameId}:scenario:${scenario}:guesses`
    );

    const points = {};
    for (const player of players) {
      if (game.mod === player) return acc;

      const [song, guessee] = guesses[player].split("|");
      const guesseeSong = await client.lRange(
        `sns:${gameId}:player:${guessee}:songs`,
        scenario,
        scenario
      );

      points[player] = votes[player] * 5 + (song === guesseeSong[0] ? 2 : 0);
    }

    scores.push(points);
  }

  res.json({ scores });
};

export default [
  {
    method: "get",
    path: "/api/games/:gameId/state",
    handler: getGameState,
  },
  {
    method: "get",
    path: "/api/games/:gameId/scores",
    handler: calculateScores,
  },
  {
    method: "post",
    path: "/api/games",
    handler: createGame,
  },
];
