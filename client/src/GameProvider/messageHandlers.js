import { queryClient } from "..";

const messageHandlers = {
  senariosCreated: () => {
    queryClient.invalidateQueries(["gameState"]);
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
  showVoteWinners: () => {
    queryClient.invalidateQueries(["gameState"]);
  },
  startGuessing: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/guess`);
  },
  showRoundResults: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/results`);
  },
  endGame: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState"]);
    navigate(`/game/${gameId}/results`);
  },
};

export default messageHandlers;
