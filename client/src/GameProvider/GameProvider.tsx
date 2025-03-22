import React, { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import { GameContextType, GameState } from "../types/gameTypes";
import {
  useFetchScenarios,
  useFetchPlayers,
  useGameState,
  useSongs,
  useVotes,
  useGuesses,
  useWinningSongs,
} from "../hooks/";

import messageHandlers from "./messageHandlers";
import Layout from "../components/common/Layout";

const socketUrl = "ws://localhost:3001/ws/player";

export const GameContext = createContext<GameContextType>(
  {} as GameContextType,
);

export const GameProvider = ({ children }) => {
  const gameId = window.location.pathname.split("/")[2] ?? "";
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["sns-game"]);
  const cookie = cookies["sns-game"];

  const [player, setPlayer] = useState({
    playerId: cookie?.playerId ?? "",
    isMod: cookie?.isMod ?? false,
  });
  const { playerId, isMod } = player;

  useEffect(() => {
    if (gameId && gameId !== cookie?.gameId) {
      setCookie("sns-game", { gameId, playerId: "", isMod: false });
    }
  }, [gameId, cookie?.gameId, setCookie]);

  useEffect(() => {
    setPlayer({
      playerId: cookie?.playerId ?? "",
      isMod: cookie?.isMod ?? false,
    });
  }, [cookie?.isMod, cookie?.playerId, cookies]);

  const setGameCookie = ({
    gameId,
    playerId,
    isMod,
  }: {
    gameId: string;
    playerId: string;
    isMod: boolean;
  }) => {
    setCookie("sns-game", { gameId, playerId, isMod });
    setPlayer({ playerId, isMod });
  };

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (gameId && playerId && readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "register", gameId, playerId }));
    }
  }, [gameId, playerId, readyState, sendMessage]);

  useEffect(() => {
    if (!lastMessage) return;

    const msg = lastMessage.data;
    console.info("Received message:", msg);
    if (typeof msg === "string" && messageHandlers[msg]) {
      messageHandlers[msg]({ navigate, gameId });
    }
  }, [gameId, lastMessage, navigate]);

  const { data: game, isLoading: gameStateLoading } = useGameState(gameId);
  const gameState: GameState = game?.gameState ?? "lobby";

  const currentScenario = game?.currentScenario;

  const { data: players = [], isLoading: playerDataLoading } =
    useFetchPlayers(gameId);
  const playerData = players.find((player) => player.id === playerId);

  const { data: scenarios = [], isLoading: scenariosLoading } =
    useFetchScenarios(gameId, gameState);
  const { data: votes = [], isLoading: votesLoading } = useVotes(
    gameId,
    gameState,
  );
  const { data: guesses = [], isLoading: guessesLoading } = useGuesses(
    gameId,
    gameState,
  );
  const { data: winningSongs = [], isLoading: winningSongsLoading } =
    useWinningSongs(gameId, gameState);
  const { data: songs = {}, isLoading: songsLoading } = useSongs(
    gameId,
    gameState,
  );
  console.log(scenariosLoading, scenarios, currentScenario, gameState, game);

  const loading =
    gameStateLoading ||
    playerDataLoading ||
    scenariosLoading ||
    songsLoading ||
    votesLoading ||
    guessesLoading ||
    winningSongsLoading;

  let error: string | null = null;

  if (!gameId) error = "Game ID is missing.";
  else if (!playerId) error = "Player ID is missing.";

  return (
    <GameContext.Provider
      value={
        {
          gameId,
          playerId,
          playerName: playerData?.name ?? undefined,
          isMod: isMod || playerData?.isMod || false,
          setGameCookie,
          gameState,
          currentScenario,
          players,
          scenarios,
          songs,
          winningSongs,
          votes,
          guesses,
          loading,
          error,
          sendMessage,
        } as GameContextType
      }
    >
      <Layout>{children}</Layout>
    </GameContext.Provider>
  );
};
