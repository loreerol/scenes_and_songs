import { queryClient } from "..";

const messageHandlers = {
  playerJoined: () => {
    queryClient.invalidateQueries(["players"]);
  },
  senariosCreated: () => {
    queryClient.invalidateQueries(["gameState"]);
  },
  updateSongs: () => {
    queryClient.invalidateQueries(["songs"]);
  },
  gameStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    queryClient.invalidateQueries(["songs"]);
    navigate(`/game/${gameId}/music`);
  },
  votingStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/vote`);
  },
  updateVotes: () => {
    queryClient.invalidateQueries(["votes"]);
  },
  showVoteWinners: () => {
    queryClient.invalidateQueries(["gameState"]);
  },
  startGuessing: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/guess`);
  },
  updateGuesses: () => {
    queryClient.invalidateQueries(["guesses"]);
  },
  showRoundResults: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/results`);
  },
  startNextRound: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/music`);
  },
};

export default messageHandlers;
