import React, { createContext, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import { GameContextType } from "../types/gameTypes";


import messageHandlers from "./messageHandlers";
import Layout from "../components/common/Layout";
import useGameData from "./useGameData";
import usePlayer from "./usePlayer";

const socketUrl = "ws://localhost:3001/ws/player";

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export const GameProvider = ({ children }) => {
  const gameId = window.location.pathname.split("/")[2] ?? "";
  const navigate = useNavigate();

  const {
    gameState,
    currentScenario,
    players,
    scenarios,
    votes,
    guesses,
    winningSongs,
    songs,
    loading,
  } = useGameData(gameId);

  const { player, setGameCookie } = usePlayer(gameId);
  const { playerId, isMod } = player;
  const playerData = players.find((player) => player.id === playerId);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (gameId && playerId && readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "register", gameId, playerId }));
    }
  }, [gameId, playerId, readyState, sendMessage]);

  useEffect(() => {
    if (!lastMessage?.data) return;

    const msg = lastMessage.data;
    console.info("Received message:", msg);

    if (typeof msg === "string" && messageHandlers[msg]) {
      messageHandlers[msg]({ navigate, gameId });
    }
  }, [gameId, lastMessage, navigate]);

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
