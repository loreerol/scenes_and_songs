const submitVote = async (req, res, client) => {
  console.info("submitVote");
  const gameId = req.params.gameId;
  const playerVoting = req.body.playerId;
  const scenario = req.body.scenario;
  const song = req.body.song;

  const voted = await client.get(`sns:${gameId}:player:${playerVoting}:voted`);
  if (voted) {
    res.status(400).json({ message: "Player has already voted" });
    return;
  }

  const songs = [];
  for (const playerId of players) {
    const s = await client.lRange(
      `sns:${gameId}:player:${playerId}:songs`,
      scenario,
      scenario + 1
    );
    songs.push({ playerId, song: s[0] });
  }

  const playerVotedFor = songs.find((s) => s.song === song).playerId;

  // TODO concurency issues continued?????
  await client.hIncrBy(
    `sns:${gameId}:scenario:${scenario}:votes`,
    playerVotedFor,
    1
  );

  await client.set(`sns:${gameId}:player:${playerVoting}:voted`, true);

  res.json({ playerVoting, scenario, song });
};

export default [
  {
    method: "post",
    path: "/api/games/:gameId/votes",
    handler: submitVote,
  },
];
