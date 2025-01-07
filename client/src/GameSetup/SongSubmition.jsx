import React, { useContext, useState } from "react";

import { GameContext } from "../GameProvider";

const SongSubmition = () => {
  const { scenarios } = useContext(GameContext);
  const [songs, setSongs] = useState(Array(scenarios.length).fill(""));

  const onSongInput = (e, i) => {
    const newSongs = [...songs];
    newSongs[i] = e.target.value;
    setSongs(newSongs);
  };

  return (
    <div>
      <p>Submit a song for each scenario</p>
      <form>
        {scenarios.map((scenario, i) => (
          <div key={i}>
            <p>{scenario}</p>
            <label>
              Song:{" "}
              <input
                name={`song-${i}`}
                value={songs[i]}
                onInput={(e) => onSongInput(e, i)}
              />
            </label>
            <br />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SongSubmition;
