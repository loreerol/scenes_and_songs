import { useQuery, useMutation } from "react-query";
import { voteQueryKeys } from "./queryKeys";
import { fetchVotes, submitVote } from "./services";
import { Votes } from "../../types/gameTypes";

export const useVotes = (gameId: string, gameState: string) =>
  useQuery<Votes[]>(voteQueryKeys.game(gameId), () => fetchVotes(gameId), {
    enabled: Boolean(gameId) && gameState === "voting-phase",
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useVoteMutation = (gameId: string, options?: any) =>
  useMutation(
    ({
      playerId,
      scenario,
      song,
    }: {
      playerId: string;
      scenario: string;
      song: string;
    }) => submitVote(gameId, { playerId, scenario, song }),
    options,
  );
