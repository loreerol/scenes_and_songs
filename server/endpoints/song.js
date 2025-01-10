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

const _checkDuplicates = async (client, gameId, songData, scenarios) => {
  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);
  const submissions = await Promise.all(
    players.map(
      async (id) =>
        await client.lRange(`sns:${gameId}:player:${id}:songs`, 0, -1)
    )
  );

  const duplicates = [];
  scenarios.forEach((scenario, i) => {
    const song = songData.find((s) => s.scenario === scenario).song;
    const submittedSongs = submissions
      .filter((submission) => submission.length)
      .map((submission) => submission[i]);

    if (submittedSongs.includes(song)) {
      duplicates.push(scenario);
    }
  });

  return duplicates;
};

const _getYouTubeVideoDetails = async (url) => {
  const videoId = videoUrl.split("v=")[1]?.split("&")[0];
  if (!videoId) throw new Error("Invalid YouTube video URL");

  const apiKey = process.env.YOUTUBE_API_KEY;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: "snippet",
          id: videoId,
          key: apiKey,
        },
      }
    );

    if (response.data.items.length === 0) throw new Error("Video not found");

    const videoDetails = response.data.items[0].snippet;
    return {
      videoId,
      title: videoDetails.title,
      description: videoDetails.description,
    };
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    throw new Error("Error failed to fetch video details");
  }
};

const _saveSongs = async (client, gameId, playerId, songData) => {
  const errors = [];
  const songDetails = [];
  for (let song of songData) {
    try {
      const videoDetails = await _getYouTubeVideoDetails(song.url);
      songDetails.push({ scenario: song.scenario, ...videoDetails });
    } catch (error) {
      errors.push({ scenario: song.scenario, error: error.message });
      continue;
    }
  }
  if (errors.length) return { errors };

  for (let song of songDetails) {
    const key = `sns:${gameId}:player:${playerId}:song:${song.videoId}`;
    await client.hSet(key, song);
  }

  await client.rPush(
    `sns:${gameId}:player:${playerId}:songs`,
    songDetails.map((s) => s.videoId)
  );
};

const submitSongs = async (req, res, client, sockets) => {
  const gameId = req.params.gameId;
  const { playerId, songData } = req.body;
  const songsKey = `sns:${gameId}:player:${playerId}:songs`;

  const game = await client.hGetAll(`sns:${gameId}`);

  const existingSongs = await client.lRange(songsKey, 0, -1);
  if (existingSongs.length) {
    res.status(400).json({ message: "Songs for this player already exist" });
    return;
  }

  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);
  const duplicates = await _checkDuplicates(
    client,
    gameId,
    songData,
    scenarios
  );
  if (duplicates.length) {
    const message = `The songs chosen for the following scenarios have already been selected: ${duplicates.join(
      ", "
    )}. Please choose a different song.`;

    res.status(400).json({ message });
    return;
  }

  await _saveSongs(client, gameId, playerId, songData);

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
