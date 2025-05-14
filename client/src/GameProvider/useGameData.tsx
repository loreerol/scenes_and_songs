import {
  useFetchScenarios,
  useFetchPlayers,
  useVotes,
  useGuesses,
  useWinningSongs,
  useSongs,
  useGameState,
} from "../hooks/";

const useGameData = (gameId) => {
  const { data: game, isLoading: gameStateLoading } = useGameState(gameId);
  const gameState = game?.gameState ?? "lobby";

  const { data: players = [], isLoading: playerDataLoading } =
    useFetchPlayers(gameId);
  const { data: scenarios = [], isLoading: scenariosLoading } =
    useFetchScenarios(gameId, gameState);
  const { data: votes = [], isLoading: votesLoading } = useVotes(
    gameId,
    gameState
  );
  const { data: guesses = [], isLoading: guessesLoading } = useGuesses(
    gameId,
    gameState
  );
  const { data: winningSongs = [], isLoading: winningSongsLoading } =
    useWinningSongs(gameId, gameState);
  const { data: songs = {}, isLoading: songsLoading } = useSongs(
    gameId,
    gameState
  );

  const currentScenario = game?.currentScenario;

  const loading = [
    gameStateLoading,
    playerDataLoading,
    scenariosLoading,
    songsLoading,
    votesLoading,
    guessesLoading,
    winningSongsLoading,
  ].some(Boolean);

  return {
    gameState,
    players,
    scenarios,
    currentScenario,
    votes,
    guesses,
    winningSongs,
    songs,
    loading,
  };
};

export default useGameData;
