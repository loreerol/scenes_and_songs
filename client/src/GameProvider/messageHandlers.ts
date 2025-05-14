import { queryClient } from "..";

const messageHandlers = {
  playerJoined: () => {
    queryClient.invalidateQueries(["players"]);
  },
  senariosCreated: ({ gameId }) => {
    queryClient.invalidateQueries(["gameState", gameId]);
  },
  updateSongs: ({ gameId }) => {
    queryClient.invalidateQueries(["songs", gameId]);
  },
  gameStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState", gameId]);
    queryClient.invalidateQueries(["scenarios", gameId]);
    queryClient.invalidateQueries(["songs", gameId]);
    navigate(`/game/${gameId}/music`);
  },
  votingStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState", gameId]);
    navigate(`/game/${gameId}/vote`);
  },
  updateVotes: ({ gameId }) => {
    queryClient.invalidateQueries(["votes", gameId]);
  },
  showVoteWinners: (gameId) => {
    queryClient.invalidateQueries(["gameState", gameId]);
  },
  startGuessing: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState", gameId]);
    navigate(`/game/${gameId}/guess`);
  },
  updateGuesses: ({ gameId }) => {
    queryClient.invalidateQueries(["guesses", gameId]);
  },
  showRoundResults: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState", gameId]);
    navigate(`/game/${gameId}/results`);
  },
  startNextRound: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState", gameId]);
    navigate(`/game/${gameId}/music`);
  },
};

export default messageHandlers;
