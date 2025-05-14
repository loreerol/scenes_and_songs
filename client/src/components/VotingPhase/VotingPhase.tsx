import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../../GameProvider";
import { useVoteMutation, useVideoTitles } from "../../hooks"; // Ensure useVideoTitles hook is used
import { queryClient } from "../..";
import { GameStateMapping } from "../../types/gameTypes";

interface Song {
  playerId: string;
  song: string;
  videoId: string;
}

const VotingPhase = () => {
  const navigate = useNavigate();
  const {
    gameId,
    gameState,
    playerId,
    isMod,
    currentScenario,
    players,
    scenarios,
    songs: allSongs,
    votes,
    winningSongs,
    loading,
    sendMessage,
  } = useContext(GameContext) as GameStateMapping["voting-phase"];

  const [selectedSong, setSelectedSong] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: vote } = useVoteMutation(gameId, {
    onSuccess: () => setSubmitted(true),
    onError: (err: any) => {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        console.error(err.code);
      }
    },
  });

  const scenarioSongs: Song[] = useMemo(
    () =>
      allSongs
        ? Object.entries(allSongs).map(([playerId, songs]) => ({
            playerId,
            song: songs[currentScenario]?.song || "",
            videoId:
              songs[currentScenario]?.song.split("v=")[1]?.split("&")[0] || "",
          }))
        : [],
    [allSongs, currentScenario],
  );

  const {
    data: videoTitles,
    isLoading: videosLoading,
    isError,
  } = useVideoTitles(scenarioSongs);

  const winningSongTitles = useMemo(() => {
    if (!winningSongs || !videoTitles) return [];
    return winningSongs.map((songUrl) => {
      const videoId = songUrl.split("v=")[1]?.split("&")[0];
      const matchingTitle = videoTitles.find(
        (item) => item.videoId === videoId,
      );
      return matchingTitle?.title || "Unknown Title";
    });
  }, [winningSongs, videoTitles]);

  useEffect(() => {
    if (votes?.[currentScenario]?.[playerId]) {
      setSubmitted(Boolean(parseInt(votes[currentScenario][playerId])));
    }
  }, [votes, currentScenario, playerId]);

  if (loading || videosLoading || typeof votes === "undefined")
    return <p className="text-center text-purple-500 font-bold">Loading...</p>;

  if (!currentScenario || !allSongs)
    return (
      <p className="text-center text-red-500 font-bold">
        No scenario or songs available.
      </p>
    );

  const submitVote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vote({ playerId, scenario: currentScenario, song: selectedSong });
  };

  const closeVoting = () => {
    sendMessage(JSON.stringify({ type: "closeVoting", gameId }));
    queryClient.invalidateQueries(["gameState", gameId]);
  };

  const goToGuessing = () => {
    sendMessage(JSON.stringify({ type: "startGuessing", gameId }));
    queryClient.invalidateQueries(["gameState", gameId]);
    navigate(`/game/${gameId}/guess`);
  };

  const currentScenarioVotes = Object.values(
    votes[currentScenario] || [],
  ).reduce((a, b) => Number(a) + Number(b), 0);
  const totalPlayers = players.filter(({ isMod }) => !isMod).length;
  const votingStateMessage = `${currentScenarioVotes}/${totalPlayers} players have voted.`;

  const renderContent = () => {
    if (gameState === "voting-phase") {
      return isMod ? (
        <>
          <p className="text-lg font-extrabold text-purple-900">
            Scenario: "{scenarios[currentScenario].text}"
          </p>
          <p className="text-lg text-gray-700 mt-4">
            Waiting for players to vote.
          </p>
          <p>{votingStateMessage}</p>
          <button
            onClick={closeVoting}
            className="mt-6 px-6 py-2 bg-purple-500 text-white font-bold rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Close Voting
          </button>
        </>
      ) : (
        <>
          <p className="text-lg font-extrabold text-purple-900">
            Scenario: "{scenarios[currentScenario].text}"
          </p>
          {submitted ? (
            <p className="text-lg font-extrabold text-green-600 mt-4">
              Vote submitted!
            </p>
          ) : (
            <>
              {error && (
                <p className="text-red-500 font-bold text-center mt-4">
                  {error}
                </p>
              )}
              <form onSubmit={submitVote} className="mt-6">
                <div className="space-y-4">
                  {videosLoading ? (
                    <p>Loading titles...</p>
                  ) : isError ? (
                    <p className="text-red-500">Error loading titles</p>
                  ) : (
                    scenarioSongs.map((song) => {
                      const title =
                        videoTitles?.find(
                          (item) => item.videoId === song.videoId,
                        )?.title ?? "Unknown Title";
                      return (
                        song.playerId !== playerId && (
                          <div
                            key={song.song}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              id={song.song}
                              name="song"
                              value={song.song}
                              checked={selectedSong === song.song}
                              onChange={(e) => setSelectedSong(e.target.value)}
                              className="h-5 w-5 text-purple-500 focus:ring-purple-400"
                            />
                            <label
                              htmlFor={song.song}
                              className="text-lg font-medium text-purple-900"
                            >
                              {title}
                            </label>
                          </div>
                        )
                      );
                    })
                  )}
                </div>
                <button
                  type="submit"
                  className="mt-6 px-6 py-2 bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  Submit Vote
                </button>
              </form>
            </>
          )}
        </>
      );
    } else if (gameState === "voting-phase-results") {
      return (
        <>
          <ul className="text-lg text-gray-700 mt-4">
            <h2>Winner:</h2>
            {winningSongTitles.map((title, index) => (
              <li key={index} className="mt-2">
                {title}
              </li>
            ))}
          </ul>
          {isMod && (
            <button
              onClick={goToGuessing}
              className="mt-6 px-6 py-2 bg-purple-500 text-white font-bold rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Start Guessing
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div className="relative border-4 border-purple-400 rounded-xl p-6 bg-white shadow-md text-gray-900">
      <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
        🎶 Voting Phase
      </h2>
      <div className="text-center">{renderContent()}</div>
    </div>
  );
};

export default VotingPhase;
