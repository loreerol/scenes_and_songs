import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../GameProvider";
import { useGuessMutation, useVideoTitles } from "../../hooks";
import { queryClient } from "../../index";

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
    guesses,
    loading,
    sendMessage,
  } = useContext(GameContext);

  const [guess, setGuess] = useState<{ player: string; song: string }>({
    player: "",
    song: "",
  });
  const [submittedGuess, setSubmittedGuess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (currentScenario && guesses?.[currentScenario]?.[playerId]) {
      setSubmittedGuess(Boolean(guesses[currentScenario][playerId]));
    }
  }, [currentScenario, guesses, playerId]);

  const scenarioSongs = useMemo(() => {
    if (!songs || !currentScenario) return [];
    return Object.entries(songs).map(([pId, scenarioData]) => {
      const rawSongUrl = scenarioData[currentScenario]?.song || "";
      return {
        playerId: pId,
        song: rawSongUrl,
        videoId: rawSongUrl.split("v=")[1]?.split("&")[0] || "",
      };
    });
  }, [songs, currentScenario]);

  // const {
  //   data: videoTitles = [],
  //   isLoading: titlesLoading,
  //   isError: titlesError,
  // } = useQuery<VideoTitle[]>(["videoTitles", scenarioSongs], () => fetchVideoTitles(scenarioSongs), {
  //   enabled: scenarioSongs.length > 0,
  // });

  const {
    data: videoTitles = [],
    isLoading: titlesLoading,
    isError: titlesError,
  } = useVideoTitles(scenarioSongs);

  if (
    loading ||
    !players?.length ||
    !songs ||
    !winningSongs?.length ||
    typeof guesses === "undefined" ||
    !currentScenario
  ) {
    return <p>Loading...</p>;
  }

  const selectGuess = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [song, player] = e.target.value.split("|");
    setGuess({ player, song });
  };

  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    guessPost({ playerId, song: guess.song, guess: guess.player } as any);
  };

  const closeGuessing = () => {
    sendMessage(JSON.stringify({ type: "closeGuessing", gameId }));
    queryClient.invalidateQueries(["gameState", gameId]);
  };

  const showRoundResults = () => {
    sendMessage(JSON.stringify({ type: "showRoundResults", gameId }));
    queryClient.invalidateQueries(["gameState", gameId]);
    navigate(`/game/${gameId}/results`);
  };

  const currentScenarioGuesses = guesses[currentScenario]
    ? Object.keys(guesses[currentScenario]).length
    : 0;
  const totalPlayers = players.filter(({ isMod }) => !isMod).length;
  const guessingStateMessage = `${currentScenarioGuesses}/${totalPlayers} players have guessed.`;

  let content: JSX.Element | null = null;

  if (isMod) {
    if (gameState === "guessing-phase") {
      content = (
        <div className="text-center">
          <p className="text-lg mt-4">Waiting for players to guess.</p>
          <p className="font-semibold mb-4">{guessingStateMessage}</p>
          <button
            onClick={closeGuessing}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
          >
            Close Guessing
          </button>
        </div>
      );
    } else if (gameState === "guessing-phase-results") {
      const songsForScenario = scenarioSongs.map(
        ({ playerId, song, videoId }) => {
          const title =
            videoTitles.find((item) => item.videoId === videoId)?.title ||
            song ||
            "Unknown Title";
          const playerName =
            players.find((pl) => pl.id === playerId)?.name || "Player";
          return { playerName, song, videoId, title };
        },
      );

      const winningScenarioSongs = songsForScenario.filter(({ song }) =>
        winningSongs.includes(song),
      );

      content = (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Results
          </h2>
          {winningScenarioSongs.length === 0 ? (
            <p>No winning songs found for this scenario.</p>
          ) : null}
          {winningScenarioSongs.map(({ playerName, title }) => (
            <p key={playerName} className="mb-2">
              <strong>{playerName}</strong> submitted <em>{title}</em>.
            </p>
          ))}
          <button
            onClick={showRoundResults}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 mt-4"
          >
            Show Round Results
          </button>
        </div>
      );
    }
  } else {
    content = submittedGuess ? (
      <p className="text-lg font-extrabold text-green-600 text-center mt-4">
        You've submitted your guess!
      </p>
    ) : (
      <form onSubmit={submitGuess} className="space-y-6">
        <br />
        {error && (
          <p className="text-red-600 font-medium text-center">{error}</p>
        )}

        {titlesLoading ? (
          <p>Loading song titles...</p>
        ) : titlesError ? (
          <p className="text-red-500">Error loading titles</p>
        ) : (
          winningSongs.map((songUrl) => {
            const videoId = songUrl.split("v=")[1]?.split("&")[0] || "";
            const title =
              videoTitles.find((item) => item.videoId === videoId)?.title ||
              songUrl ||
              "Unknown Title";

            return (
              <div key={songUrl} className="border p-4 rounded-lg">
                <p className="font-semibold text-lg text-purple-800">
                  Song: {title}
                </p>
                {players.map(({ id, name, isMod }) =>
                  !isMod && id !== playerId ? (
                    <div key={id} className="flex items-center space-x-2 mt-2">
                      <input
                        type="radio"
                        name="player"
                        value={`${songUrl}|${id}`}
                        checked={guess.song === songUrl && guess.player === id}
                        onChange={selectGuess}
                        className="form-radio text-purple-600"
                      />
                      <label htmlFor={id}>{name}</label>
                    </div>
                  ) : null,
                )}
              </div>
            );
          })
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 mt-4"
        >
          Submit Guess
        </button>
      </form>
    );
  }

  return (
    <div className="relative border-4 border-purple-400 rounded-xl p-6 bg-white shadow-md text-gray-900">
      {content}
    </div>
  );
};

export default GuessingPhase;
