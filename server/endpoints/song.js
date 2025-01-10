const getSongs = async (req, res, client) => {
  const gameId = req.params.gameId;
  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);
  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  const songsByPlayer = {};
  for (const playerId of players) {
    const songs = await client.lRange(
      `sns:${gameId}:player:${playerId}:songs`,
      0,
      -1
    );

    songsByPlayer[playerId] = scenarios.map((scenario, i) => ({
      scenario,
      song: songs[i],
    }));
  }

  res.json({ songs: songsByPlayer });
};

const getWinningSongs = async (req, res, client) => {
  const gameId = req.params.gameId;

  const scenario = await client.hGet(`sns:${gameId}`, "scenario");
  const votes = await client.hGetAll(
    `sns:${gameId}:scenario:${scenario}:votes`
  );

  const highestVoteCount = Math.max(...Object.values(votes)).toString();
  const winningPlayers = Object.entries(votes)
    .filter(([_, voteCount]) => voteCount === highestVoteCount)
    .map(([playerId, _]) => playerId);

  const winningSongs = [];
  for (const playerId of winningPlayers) {
    const song = await client.lRange(
      `sns:${gameId}:player:${playerId}:songs`,
      scenario,
      scenario
    );
    winningSongs.push(song[0]);
  }

  res.json({ winningSongs });
};

const submitSongs = async (req, res, client, sockets) => {
  const gameId = req.params.gameId;
  const playerId = req.body.playerId;
  const songData = req.body.songs;
  const songsKey = `sns:${gameId}:player:${playerId}:songs`;

  const game = await client.hGetAll(`sns:${gameId}`);

  const existingSongs = await client.lRange(songsKey, 0, -1);
  if (existingSongs.length) {
    res.status(400).json({ message: "Songs for this player already exist" });
    return;
  }

  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);
  const submissions = await Promise.all(
    players.map(
      async (id) =>
        await client.lRange(`sns:${gameId}:player:${id}:songs`, 0, -1)
    )
  );

  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  const duplicates = [];
  const songs = scenarios.map((scenario, i) => {
    const song = songData.find((s) => s.scenario === scenario).song;
    const submittedSongs = submissions
      .filter((submission) => submission.length)
      .map((submission) => submission[i]);

    if (submittedSongs.includes(song)) {
      duplicates.push(scenario);
    }
    return song;
  });

  if (duplicates.length) {
    const message = `The songs chosen for the following scenarios have already been selected: ${duplicates.join(
      ", "
    )}. Please choose a different song.`;

    res.status(400).json({ message });
    return;
  }

  await client.rPush(songsKey, songs);

  const modSocket = sockets[gameId][game.mod];
  if (modSocket) {
    modSocket.send("updateSongs");
  }

  res.json({ songs });
};

export default [
  {
    method: "get",
    path: "/api/games/:gameId/songs",
    handler: getSongs,
  },
  {
    method: "get",
    path: "/api/games/:gameId/songs/winning",
    handler: getWinningSongs,
  },
  {
    method: "post",
    path: "/api/games/:gameId/songs",
    handler: submitSongs,
  },
];
