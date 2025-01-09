import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../GameProvider";
import { useGuessMutation } from "../hooks";
import { queryClient } from "..";

const GuessingPhase = () => {
  const navigate = useNavigate();
  const {
    gameId,
    playerId,
    isMod,
    gameState,
    currentScenario,
    players,
    songs,
    winningSongs,
    loading,
    sendMessage,
  } = useContext(GameContext);
  const [guess, setGuess] = useState({ player: "", song: "" });
  const [submittedGuess, setSubmittedGuess] = useState(false);
  const [error, setError] = useState(null);

  const { mutate: guessPost } = useGuessMutation(gameId, {
    onSuccess: () => setSubmittedGuess(true),
    onError: (err) => {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        console.error(err);
      }
    },
  });

  if (loading || !players?.length || !songs || !winningSongs.length)
    return <p>Loading...</p>;

  const selectGuess = (e) => {
    const [song, player] = e.target.value.split("|");
    setGuess({ player, song });
  };

  const submitGuess = (e) => {
    e.preventDefault();
    guessPost({ playerId, song: guess.song, guess: guess.player });
  };

  const closeGuessing = () => {
    sendMessage(JSON.stringify({ type: "closeGuessing", gameId }));
    queryClient.invalidateQueries(["gameState"]);
  };

  const showRoundResults = () => {
    sendMessage(JSON.stringify({ type: "showRoundResults", gameId }));
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/results`);
  };

  let content;
  if (isMod) {
    console.info("gameState", gameState);
    if (gameState === "guessing-phase") {
      content = (
        <>
          <p>Waiting for players to guess.</p>
          <button onClick={closeGuessing}>Close Guessing</button>
        </>
      );
    } else if (gameState === "guessing-phase-results") {
      const songsForScenario = Object.entries(songs).map(
        ([playerId, songs]) => ({
          playerName: players.find((player) => player.id === playerId).name,
          song: songs[currentScenario].song,
        })
      );

      content = (
        <>
          {songsForScenario
            .filter(({ song }) => winningSongs.includes(song))
            .map(({ playerName, song }) => (
              <p key={playerName}>
                {playerName} submitted {song}.
              </p>
            ))}
          <button onClick={showRoundResults}>Show Round Results</button>
        </>
      );
    }
  } else {
    if (submittedGuess) {
      content = <p>You've submitted your guess</p>;
    } else {
      content = (
        <form onSubmit={submitGuess}>
          <br />
          {error && (
            <>
              <p style={{ color: "red" }}>{error}</p>
              <br />
            </>
          )}
          {winningSongs.map((song) => (
            <div key={song}>
              <p>Song: {song}</p>
              {players.map(
                ({ id, name, isMod }) =>
                  !isMod &&
                  id !== playerId && (
                    <div key={id}>
                      <input
                        type="radio"
                        name="player"
                        value={`${song}|${id}`}
                        checked={guess.song === song && guess.player === id}
                        onChange={selectGuess}
                      />{" "}
                      <label htmlFor={id}>{name}</label>
                    </div>
                  )
              )}
              <br />
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      );
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <p>Guessing Phase</p>
      {content}
    </div>
  );
};

export default GuessingPhase;
