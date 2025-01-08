import React, { useContext, useState } from "react";
import { useMutation } from "react-query";

import axios from "../axios";
import { GameContext } from "../GameProvider";

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

  return (
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
  );
};

export default SongSubmition;
