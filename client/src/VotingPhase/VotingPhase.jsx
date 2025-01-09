import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../GameProvider";
import { useVoteMutation } from "../hooks";
import { queryClient } from "..";

const VotingPhase = () => {
  const navigate = useNavigate();
  const {
    gameId,
    gameState,
    playerId,
    isMod,
    currentScenario,
    scenarios,
    songs: allSongs,
    winningSongs,
    loading,
    sendMessage,
  } = useContext(GameContext);
  const [selectedSong, setSelectedSong] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const { mutate: vote } = useVoteMutation(gameId, {
    onSuccess: () => setSubmitted(true),
    onError: (err) => {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        console.error(err.code);
      }
    },
  });

  const scenarioSongs = useMemo(
    () =>
      allSongs
        ? Object.entries(allSongs).map(([playerId, songs]) => ({
            playerId,
            song: songs[currentScenario].song,
          }))
        : [],
    [allSongs, currentScenario]
  );

  if (loading || typeof currentScenario === "undefined" || !allSongs)
    return <p>Loading...</p>;

  const submitVote = (e) => {
    e.preventDefault();
    vote({ playerId, scenario: currentScenario, song: selectedSong });
  };

  const closeVoting = () => {
    sendMessage(JSON.stringify({ type: "closeVoting", gameId }));
    queryClient.invalidateQueries(["gameState"]);
  };

  const goToGuessing = () => {
    sendMessage(JSON.stringify({ type: "startGuessing", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/guess`);
  };

  let content;
  if (gameState === "voting-phase") {
    if (isMod) {
      content = (
        <>
          <p>Scenario: "{scenarios[currentScenario]}"</p>
          <p>Waiting for players to vote.</p>
          <button onClick={closeVoting}>Close Voting</button>
        </>
      );
    } else {
      content = (
        <>
          <p>Scenario: "{scenarios[currentScenario]}"</p>
          {submitted ? (
            <p>Vote submitted!</p>
          ) : (
            <>
              {error && <p style={{ color: "red" }}>{error}</p>}
              Songs: <br />
              <br />
              <form onSubmit={submitVote}>
                {scenarioSongs.map(
                  (song) =>
                    song.playerId !== playerId && (
                      <div key={song.song}>
                        <input
                          type="radio"
                          name="song"
                          value={song.song}
                          checked={selectedSong === song.song}
                          onChange={(e) => setSelectedSong(e.target.value)}
                        />{" "}
                        <label htmlFor={song.song}>{song.song}</label>
                      </div>
                    )
                )}
                <br />
                <button type="submit">Submit</button>
              </form>
            </>
          )}
        </>
      );
    }
  } else if (gameState === "voting-phase-results") {
    content = (
      <>
        <p>Winning songs: {winningSongs.join(", ")}</p>
        {isMod && <button onClick={goToGuessing}>Start Guessing</button>}
      </>
    );
  }

  return (
    <div style={{ padding: 10 }}>
      <p>Voting Phase</p>
      {content}
    </div>
  );
};

export default VotingPhase;
