import React, { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import useWebSocket, { ReadyState } from "react-use-websocket";

import axios from "../axios";
import messageHandlers from "./messageHandlers";
import { useNavigate } from "react-router-dom";

const socketUrl = "ws://localhost:3001/ws/player";

export const GameContext = createContext({
  gameId: null,
  playerId: null,
  isMod: false,
  setGameCookie: () => {},
});

export const GameProvider = ({ children }) => {
  const gameId = window.location.pathname.split("/")[2];
  const navigate = useNavigate();
  // cookies
  const [cookies, setCookie] = useCookies(["sns-game"]);
  const cookie = cookies["sns-game"];

  const [player, setPlayer] = useState({
    playerId: cookie?.playerId || null,
    isMod: cookie?.isMod || false,
  });
  const { playerId, isMod } = player;

  useEffect(() => {
    if (gameId !== cookie?.gameId) {
      setCookie("sns-game", { gameId, playerId: null, isMod: false });
    }
  }, [gameId]);

  useEffect(() => {
    setPlayer({
      playerId: cookie?.playerId || null,
      isMod: cookie?.isMod || false,
    });
  }, [cookies]);

  const setGameCookie = ({ gameId, playerId, isMod }) => {
    setCookie("sns-game", { gameId, playerId, isMod });
    setPlayer({ playerId, isMod });
  };

  // websockets
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (gameId && playerId && readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "register", gameId, playerId }));
    }
  }, [gameId, playerId, readyState]);

  useEffect(() => {
    if (!lastMessage) return;

    const msg = lastMessage.data;
    console.info("Recieved message:", msg);
    if (typeof msg === "string" && messageHandlers[msg])
      messageHandlers[msg]({ navigate, gameId });
  }, [lastMessage?.data]);

  // queries for data
  const { data: game, isLoading: gameStateLoading } = useQuery(
    ["gameState"],
    () => axios.get(`games/${gameId}/state`).then((res) => res.data),
    {
      enabled: Boolean(gameId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );
  const gameState = game?.gameState;
  const currentScenario = game?.currentScenario;

  const { data: playerData, isLoading: playerDataLoading } = useQuery(
    ["playerName"],
    () =>
      axios.get(`games/${gameId}/players/${playerId}`).then((res) => res.data),
    {
      enabled: Boolean(gameId && playerId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  const { data: scenarios, isLoading: scenariosLoading } = useQuery(
    ["scenarios"],
    () =>
      axios.get(`games/${gameId}/scenarios`).then((res) => res.data.scenarios),
    {
      enabled: Boolean(gameId) && Boolean(gameState) && gameState !== "lobby",
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  const { data: songs, isLoading: songsLoading } = useQuery(
    ["songs"],
    () => axios.get(`games/${gameId}/songs`).then((res) => res.data.songs),
    {
      enabled:
        Boolean(gameId) &&
        Boolean(gameState) &&
        ["song-selection", "music-phase"].includes(gameState),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  const loading =
    gameStateLoading || playerDataLoading || scenariosLoading || songsLoading;

  return (
    <GameContext.Provider
      value={{
        gameId,
        playerId,
        playerName: playerData?.name,
        isMod: isMod || playerData?.isMod,
        setGameCookie,
        gameState,
        currentScenario,
        scenarios,
        songs,
        loading,
        sendMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
