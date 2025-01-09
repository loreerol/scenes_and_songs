import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";

import "./styles.css";
import CreateGame from "./CreateGame/CreateGame";
import GameRedirect from "./GameRedirect";
import GameSetup from "./GameSetup";
import { GameProvider } from "./GameProvider";
import MusicPhase from "./MusicPhase";
import VotingPhase from "./VotingPhase";
import GuessingPhase from "./GuessingPhase";

export const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
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
            <Route path="/game/:id/results" element={<>Results</>} />
          </Routes>
        </GameProvider>
      </BrowserRouter>
    </CookiesProvider>
  </QueryClientProvider>
);
