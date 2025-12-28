export type GameState =
  | "lobby"
  | "song-selection"
  | "music-phase"
  | "voting-phase"
  | "voting-phase-results"
  | "guessing-phase"
  | "guessing-phase-results"
  | "round-results"
  | "game-over";

export interface Game {
  gameState: GameState;
  currentScenario?: string;
}

export interface Score {
  [playerId: string]: number;
}

export type GameScore = Score[];

export interface Player {
  id: string;
  name: string;
  isMod: boolean;
  score: number;
}

export interface Guess {
  player: string;
  song: string;
}

export interface SongEntry {
  scenario: string;
  song: string;
}

export interface Songs {
  [playerId: string]: SongEntry[];
}

export interface Votes {
  [playerId: string]: `${number}`;
}

export interface Scenario {
  id: string;
  text: string;
  createdBy: string;
  gameId: string;
}

export interface VideoTitle {
  videoId: string;
  title: string;
}

interface BaseGameContext {
  gameId: string;
  playerId: string;
  playerName?: string;
  isMod: boolean;
  setGameCookie: (params: {
    gameId: string;
    playerId: string;
    isMod: boolean;
  }) => void;
  players: Player[];
  scenarios?: Scenario[];
  songs?: Songs;
  winningSongs?: string[];
  votes?: Votes[];
  guesses?: Guess[];
  currentScenario?: string;
  loading: boolean;
  sendMessage: (message: string) => void;
  error: string | null;
}

export type GameStateMapping = {
  lobby: BaseGameContext & {
    gameState: "lobby";
    songs?: undefined;
    winningSongs?: undefined;
    scenarios?: undefined;
    votes?: undefined;
    guesses?: undefined;
    currentScenario?: undefined;
  };
  "song-selection": BaseGameContext & {
    gameState: "song-selection";
    scenarios: Scenario[];
  };
  "music-phase": BaseGameContext & {
    gameState: "music-phase";
    songs: Songs;
    scenarios: Scenario[];
    currentScenario: string;
  };
  "voting-phase": BaseGameContext & {
    gameState: "voting-phase";
    songs: Songs;
    votes: Votes[];
    scenarios: Scenario[];
    currentScenario: string;
  };
  "voting-phase-results": BaseGameContext & {
    gameState: "voting-phase-results";
    songs: Songs;
    votes: Votes[];
    scenarios: Scenario[];
    currentScenario: string;
  };
  "guessing-phase": BaseGameContext & {
    gameState: "guessing-phase";
    songs: Songs;
    winningSongs: GameScore[];
    scenarios: Scenario[];
    votes: Votes[];
    guesses: Guess[];
    currentScenario: string;
  };
  "guessing-phase-results": BaseGameContext & {
    gameState: "guessing-phase-results";
    songs: Songs;
    winningSongs: GameScore[];
    scenarios: Scenario[];
    votes: Votes[];
    guesses: Guess[];
    currentScenario: string;
  };
  "round-results": BaseGameContext & {
    gameState: "round-results";
    songs: Songs;
    winningSongs: GameScore[];
    scenarios: Scenario[];
    votes: Votes[];
    guesses: Guess[];
    currentScenario: string;
  };
  "game-over": BaseGameContext & {
    gameState: "game-over";
    songs: Songs;
    winningSongs: GameScore;
    scenarios: Scenario[];
    votes: Votes[];
    guesses: Guess[];
  };
};

export type GameContextType = BaseGameContext &
  GameStateMapping[keyof GameStateMapping];
