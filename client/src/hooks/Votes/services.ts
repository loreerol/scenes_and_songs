import axios from "../../axios";
import { Votes } from "../../types/gameTypes";

export const fetchVotes = async (gameId: string): Promise<Votes[]> => {
  const response = await axios.get<{ votes: Votes[] }>(`games/${gameId}/votes`);
  return response.data.votes;
};

export const submitVote = async (
  gameId: string,
  voteData: { playerId: string; scenario: string; song: string },
) => {
  const response = await axios.post(`/games/${gameId}/votes`, voteData);
  return response.data;
};
