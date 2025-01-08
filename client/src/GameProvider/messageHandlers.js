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
};

export default messageHandlers;
