import React, { useContext, useState } from "react";
import { useMutation } from "react-query";

import axios from "../axios";
import { GameContext } from "../GameProvider";
import ScenarioCard from "./ScenarioCard";

const SongSubmition = () => {
  const {
    gameId,
    playerId,
    scenarios,
    songs: allSongs,
  } = useContext(GameContext);
  const [songs, setSongs] = useState(
    scenarios.map((scenario) => ({ scenario, song: "" }))
  );
  const [error, setError] = useState();
  const [submitted, setSubmitted] = useState(
    Boolean(allSongs && allSongs[playerId].some((s) => s.song))
  );

  const { mutate: postSongs } = useMutation(() => {
    axios
      .post(`/games/${gameId}/songs`, { playerId, songs })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 400) setError(res.data.message);
      });
  });

  const submitSongs = (e) => {
    e.preventDefault();
    if (songs.some((song) => song === "")) {
      setError("Please fill out all songs");
      return;
    }
    setError(undefined);
    postSongs();
  };

  const onSongInput = (e, i) => {
    const newSongs = songs.map((s, j) =>
      i === j ? { scenario: s.scenario, song: e.target.value } : s
    );
    setSongs(newSongs);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Songs submitted:", songs);
  };

  return (
<<<<<<< HEAD
    <div>
      {submitted ? (
        <p>Waiting for mod to start the game</p>
      ) : (
        <>
          <p>Submit a song for each scenario</p>
          {error && <p>{error}</p>}
          <form onSubmit={submitSongs}>
            {songs.map(({ scenario, song }, i) => (
              <div key={i}>
                <p>{scenario}</p>
                <label>
                  Song:{" "}
                  <input
                    name={`song-${i}`}
                    value={song}
                    onInput={(e) => onSongInput(e, i)}
                  />
                </label>
                <br />
              </div>
            ))}
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
=======
    <>
      <p className="text-center text-lg font-medium text-yellow-300 mb-6">
        Submit a song for each scenario
      </p>
      <form onSubmit={onSubmit} className="grid gap-6">
        {scenarios.map((scenario, i) => (
          <ScenarioCard
            key={i}
            index={i}
            value={scenario}
            placeholder={`Scenario ${i + 1}`}
            edit={false}
            responseInput={{
              label: "Your Song:",
              value: songs[i],
              onChange: onSongInput,
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
>>>>>>> d4f3808 (song submission ui)
  );
};

export default SongSubmition;