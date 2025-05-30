const getVotes = async (req, res, client) => {
  const gameId = req.params.gameId;
  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  const votes = await Promise.all(
    scenarios.map(
      async (_, i) =>
        await client.hGetAll(`sns:${gameId}:scenario:${i}:votes`, 0, -1)
    )
  );

  res.json({ votes });
};

const submitVote = async (req, res, client, sockets) => {
  const gameId = req.params.gameId;
  const { playerId: playerVoting, scenario, song } = req.body;

  const game = await client.hGetAll(`sns:${gameId}`);

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

  const modSocket = sockets[gameId][game.mod];
  if (modSocket) {
    modSocket.send("updateVotes");
  }

  res.json({ playerVoting, scenario, song });
};

export default [
  {
    method: "get",
    path: "/api/games/:gameId/votes",
    handler: getVotes,
  },
  {
    method: "post",
    path: "/api/games/:gameId/votes",
    handler: submitVote,
  },
];
