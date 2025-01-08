import { queryClient } from "..";

const messageHandlers = {
  senariosCreated: () => {
    console.log("Scenarios created event!");
    queryClient.invalidateQueries(["gameState"]);
  },
};

export default messageHandlers;
