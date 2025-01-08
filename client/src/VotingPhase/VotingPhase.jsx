import React, { useContext, useState } from "react";

import { GameContext } from "../GameProvider";
import { useVoteMutation } from "../hooks/vote";

const VotingPhase = () => {
  const {
    gameId,
    playerId,
    isMod,
    currentScenario,
    scenarios,
    songs: allSongs,
    loading,
  } = useContext(GameContext);
  const [selectedSong, setSelectedSong] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: vote } = useVoteMutation(gameId, {
    onSuccess: () => setSubmitted(true),
    onError: (err) => console.error(err.code),
  });

  if (loading || typeof currentScenario === "undefined" || !allSongs)
    return <p>Loading...</p>;

  const scenarioSongs = Object.entries(allSongs).map(([playerId, songs]) => ({
    playerId,
    song: songs[currentScenario].song,
  }));

  const submitVote = () => {
    vote({ playerId, scenario: currentScenario, song: selectedSong });
  };

  return (
    <div style={{ padding: 10 }}>
      <p>VotingPhase</p>
      {isMod ? (
        <>
          <p>Scenario: "{scenarios[currentScenario]}"</p>
          <p>Waiting for players to vote.</p>
          <button>Close Voting</button>
        </>
      ) : (
        <>
          <p>Scenario: "{scenarios[currentScenario]}"</p>
          {submitted ? (
            <p>Vote submitted!</p>
          ) : (
            <>
              Songs: <br />
              <br />
              <form onSubmit={submitVote}>
                {scenarioSongs.map((song) => (
                  // song.playerId !== playerId &&
                  <div key={song}>
                    <input
                      type="radio"
                      name="song"
                      value={song.song}
                      checked={selectedSong === song.song}
                      onChange={(e) => setSelectedSong(e.target.value)}
                    />{" "}
                    <label htmlFor={song.song}>{song.song}</label>
                  </div>
                ))}
                <br />
                <button type="submit">Submit</button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VotingPhase;
