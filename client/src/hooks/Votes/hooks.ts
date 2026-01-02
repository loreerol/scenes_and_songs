import { useQuery, useMutation } from "@tanstack/react-query";
import { voteQueryKeys } from "./queryKeys";
import { fetchVotes, submitVote } from "./services";
import { Votes } from "../../types/gameTypes";

export const useVotes = (gameId: string, gameState: string) =>
  useQuery<Votes[]>({
    queryKey: voteQueryKeys.game(gameId),
    queryFn: () => fetchVotes(gameId),
    enabled: Boolean(gameId) && gameState === "voting-phase",
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useVoteMutation = (gameId: string, options?: any) =>
  useMutation({
    mutationKey: "submitVote",
    mutationFn: ({
      playerId,
      scenario,
      song,
    }: {
      playerId: string;
      scenario: string;
      song: string;
    }) => submitVote(gameId, { playerId, scenario, song }),
    ...options,
  });
