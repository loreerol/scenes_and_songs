import { useQuery, useMutation } from "react-query";
import { songQueryKeys } from "./queryKeys";
import { fetchSongs, fetchWinningSongs, submitSongs } from "./services";
import { SongEntry, Songs } from "../../types/gameTypes";

export const useSongs = (gameId: string, gameState: string) =>
  useQuery<Songs>(songQueryKeys.game(gameId), () => fetchSongs(gameId), {
    enabled: Boolean(gameId) && gameState !== "lobby",
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useWinningSongs = (gameId: string, gameState: string) =>
  useQuery<string[]>(
    songQueryKeys.winning(gameId),
    () => fetchWinningSongs(gameId),
    {
      enabled:
        Boolean(gameId) &&
        [
          "voting-phase-results",
          "guessing-phase",
          "guessing-phase-results",
        ].includes(gameState),
    },
  );

export const useSongsMutation = (gameId: string, options?: any) =>
  useMutation(
    ({ playerId, songs }: { playerId: string; songs: SongEntry[] }) =>
      submitSongs(gameId, playerId, songs),
    options,
  );
