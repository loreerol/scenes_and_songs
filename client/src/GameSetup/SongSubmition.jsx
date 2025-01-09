import React, { useContext, useState } from "react";

import { GameContext } from "../GameProvider";
import ScenarioCard from "./ScenarioCard";
import { useSongsMutation } from "../hooks";

const SongSubmition = () => {
  const {
    gameId,
    playerId,
    scenarios,
    songs: allSongs,
  } = useContext(GameContext);
  const playerSongs = allSongs?.[playerId] || [];

  const [songs, setSongs] = useState(
    scenarios.map((scenario, i) => ({
      scenario,
      song: playerSongs[i]?.song || "",
    }))
  );
  const [error, setError] = useState();
  const [submitted, setSubmitted] = useState(
    Boolean(playerSongs.some((s) => s.song))
  );

  const { mutate: postSongs } = useSongsMutation(gameId, {
    onSuccess: () => setSubmitted(true),
    onError: (err) => {
      const res = err.response;
      if (res?.status === 400) setError(res.data.message);
    },
  });

  const submitSongs = (e) => {
    e.preventDefault();
    if (songs.some(({ song }) => song === "")) {
      setError("Please fill out all songs");
      return;
    }
    setError(undefined);
    postSongs({ playerId, songs });
  };

  const onSongInput = (e, i) => {
    const newSongs = songs.map((s, j) =>
      i === j ? { scenario: s.scenario, song: e.target.value } : s
    );
    setSongs(newSongs);
  };

  if (!allSongs || !playerId) {
    return <p>Loading...</p>; // Show a fallback UI while waiting for data
  }

  return (
    <div>
      {submitted ? (
        <p className="text-center text-lg font-medium text-yellow-300">
          Waiting for mod to start the game
        </p>
      ) : (
        <>
          <p className="text-center text-lg font-medium text-yellow-300 mb-6">
            Submit a song for each scenario
          </p>
          {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}
          <form onSubmit={submitSongs} className="grid gap-6">
            {songs.map(({ scenario, song }, i) => (
              <ScenarioCard
                key={i}
                index={i}
                value={scenario}
                placeholder={`Scenario ${i + 1}`}
                edit={false}
                responseInput={{
                  label: "Your Song:",
                  value: song,
                  onChange: (e) => onSongInput(e, i),
                  placeholder: `Enter your song for Scenario ${i + 1}`,
                }}
              />
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-xl font-bold text-white py-3 px-8 rounded-full shadow-md hover:scale-105 transform transition duration-200"
              >
                Submit Songs 🎶
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SongSubmition;
