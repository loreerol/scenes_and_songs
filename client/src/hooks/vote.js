import { useMutation } from "react-query";

import axios from "../axios";

export const useVoteMutation = (gameId, options) =>
  useMutation(async ({ playerId, scenario, song }) => {
    console.log("useVoteMutation", playerId, scenario, song);
    await axios.get("");
    console.log("pls work");
    // return axios.post(`/games/${gameId}/votes`, { playerId, scenario, song });
  }, options);
