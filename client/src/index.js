import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { CookiesProvider } from "react-cookie";

import "./styles.css";
import CreateGame from "./components/GameCreation/CreateGame";
import GameRedirect from "./GameRedirect";
import GameSetup from "./components/GameCreation/GameSetup";
import { GameProvider } from "./GameProvider";
import MusicPhase from "./components/MusicPhase";
import VotingPhase from "./components/VotingPhase";
import GuessingPhase from "./components/GuessingPhase";
import Results from "./components/Results";

export const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <BrowserRouter>
        <GameProvider>
          <Routes>
            <Route path="/" element={<CreateGame />} />
            <Route path="/game/:id" element={<GameRedirect />} />
            <Route path="/game/:id/set-up" element={<GameSetup />} />
            <Route path="/game/:id/music" element={<MusicPhase />} />
            <Route path="/game/:id/vote" element={<VotingPhase />} />
            <Route path="/game/:id/guess" element={<GuessingPhase />} />
            <Route path="/game/:id/results" element={<Results />} />
          </Routes>
        </GameProvider>
      </BrowserRouter>
    </CookiesProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
