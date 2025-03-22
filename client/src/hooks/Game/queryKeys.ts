export const gameQueryKeys = {
  all: () => ["games"],
  game: (gameId: string) => ["gameState", gameId],
  gameState: (gameId: string) => ["gameState", gameId],
  gameScore: (gameId: string) => ["gameScore", gameId],
};
