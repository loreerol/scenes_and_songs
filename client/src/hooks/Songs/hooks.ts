import { useQuery, useMutation } from "@tanstack/react-query";
import { songQueryKeys } from "./queryKeys";
import { fetchSongs, fetchWinningSongs, submitSongs } from "./services";
import { SongEntry, Songs } from "../../types/gameTypes";

export const useSongs = (gameId: string, gameState: string) =>
  useQuery<Songs>({
    queryKey: songQueryKeys.game(gameId),
    queryFn: () => fetchSongs(gameId),
    enabled: Boolean(gameId) && gameState !== "lobby",
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useWinningSongs = (gameId: string, gameState: string) =>
  useQuery<string[]>({
    queryKey: songQueryKeys.winning(gameId),
    queryFn: () => fetchWinningSongs(gameId),
    enabled:
      Boolean(gameId) &&
      [
        "voting-phase-results",
        "guessing-phase",
        "guessing-phase-results",
      ].includes(gameState),
  });

export const useSongsMutation = (gameId: string, options?: any) =>
  useMutation({
    mutationFn: ({ playerId, songs }: { playerId: string; songs: SongEntry[] }) =>
      submitSongs(gameId, playerId, songs),
    ...options,
  });
