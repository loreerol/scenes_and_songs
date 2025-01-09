const submitGuess = async (req, res, client) => {
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

  res.json({ playerId: guesser, guess: guessee });
};

export default [
  {
    method: "post",
    path: "/api/games/:gameId/guess",
    handler: submitGuess,
  },
];
