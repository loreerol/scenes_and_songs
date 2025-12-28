import { queryClient } from "..";

const messageHandlers = {
  playerJoined: () => {
    queryClient.invalidateQueries({ queryKey: ["players"] });
  },
  senariosCreated: ({ gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
  },
  updateSongs: ({ gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["songs", gameId] });
  },
  gameStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
    queryClient.invalidateQueries({ queryKey: ["scenarios", gameId] });
    queryClient.invalidateQueries({ queryKey: ["songs", gameId] });
    navigate(`/game/${gameId}/music`);
  },
  votingStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
    navigate(`/game/${gameId}/vote`);
  },
  updateVotes: ({ gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["votes", gameId] });
  },
  showVoteWinners: (gameId) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
  },
  startGuessing: ({ navigate, gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
    navigate(`/game/${gameId}/guess`);
  },
  updateGuesses: ({ gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["guesses", gameId] });
  },
  showRoundResults: ({ navigate, gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
    navigate(`/game/${gameId}/results`);
  },
  startNextRound: ({ navigate, gameId }) => {
    queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
    navigate(`/game/${gameId}/music`);
  },
};

export default messageHandlers;
