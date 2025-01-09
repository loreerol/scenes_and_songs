import React, { useContext, useState } from "react";

import { GameContext } from "../GameProvider";

const GuessingPhase = () => {
  const { gameId, isMod, players, winningSongs, loading } =
    useContext(GameContext);
  const [guess, setGuess] = useState({ player: "", song: "" });

  if (loading || !players?.length) return <p>Loading...</p>;

  const selectGuess = (e) => {
    const [song, player] = e.target.value.split("-");
    setGuess({ player, song });
  };

  const submitGuess = (e) => {
    e.preventDefault();
    // TODO
  };

  const closeGuessing = () => {
    // TODO
  };

  return (
    <div style={{ padding: 10 }}>
      <p>Guessing Phase</p>
      {isMod ? (
        <>
          <p>Waiting for players to guess.</p>
          <button onClick={closeGuessing}>Close Guessing</button>
        </>
      ) : (
        <form onSubmit={submitGuess}>
          <br />
          {winningSongs.map((song) => (
            <div key={song}>
              <p>Song: {song}</p>
              {players.map(
                ({ id, name, isMod }) =>
                  !isMod && (
                    <div key={id}>
                      <input
                        type="radio"
                        name="player"
                        value={`${song}-${id}`}
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
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default GuessingPhase;
