import { queryClient } from "..";

const messageHandlers = {
  senariosCreated: () => {
    queryClient.invalidateQueries(["gameState"]);
  },
  gameStarted: ({ navigate, gameId }) => {
    queryClient.invalidateQueries(["gameState", "songs"]);
    navigate(`/game/${gameId}/music`);
  },
};

export default messageHandlers;
