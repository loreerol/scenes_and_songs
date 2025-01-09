const submitVote = async (req, res, client) => {
  const gameId = req.params.gameId;
  const { playerId: playerVoting, scenario, song } = req.body;

  const voteKey = `sns:${gameId}:scenario:${scenario}:player:${playerVoting}:voted`;
  const voted = await client.get(voteKey);
  if (voted) {
    res.status(400).json({ message: "Player has already voted" });
    return;
  }

  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);
  const songs = [];
  for (const playerId of players) {
    const s = await client.lRange(
      `sns:${gameId}:player:${playerId}:songs`,
      scenario,
      scenario
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

  await client.set(voteKey, "true");

  res.json({ playerVoting, scenario, song });
};

export default [
  {
    method: "post",
    path: "/api/games/:gameId/votes",
    handler: submitVote,
  },
];
