const getGuesses = async (req, res, client) => {
  const gameId = req.params.gameId;
  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  const guesses = await Promise.all(
    scenarios.map(
      async (_, i) =>
        await client.hGetAll(`sns:${gameId}:scenario:${i}:guesses`, 0, -1)
    )
  );

  res.json({ guesses });
};

const submitGuess = async (req, res, client, sockets) => {
  const gameId = req.params.gameId;
  const { playerId: guesser, song, guess: guessee } = req.body;

  const game = await client.hGetAll(`sns:${gameId}`);
  const guesses = await client.hGetAll(
    `sns:${gameId}:scenario:${game.scenario}:guesses`
  );

  if (guesses[guesser]) {
    res.status(400).json({ message: "Player has already guessed" });
    return;
  }

  await client.hSet(`sns:${gameId}:scenario:${game.scenario}:guesses`, {
    [guesser]: `${song}|${guessee}`,
  });

  const modSocket = sockets[gameId][game.mod];
  if (modSocket) {
    modSocket.send("updateGuesses");
  }

  res.json({ playerId: guesser, guess: guessee });
};

export default [
  {
    method: "get",
    path: "/api/games/:gameId/guess",
    handler: getGuesses,
  },
  {
    method: "post",
    path: "/api/games/:gameId/guess",
    handler: submitGuess,
  },
];
