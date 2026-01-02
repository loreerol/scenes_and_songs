import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
import AppErrorBoundary from "./components/ErrorBoundary/AppErrorBoundary";
import RouteErrorBoundary from "./components/ErrorBoundary/RouteErrorBoundary";
import { queryClient } from "./config/queryClient";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <BrowserRouter>
        <AppErrorBoundary>
          <GameProvider>
            <Routes>
              <Route path="/" element={<CreateGame />} />
              <Route path="/game/:id" element={<GameRedirect />} />
              <Route
                path="/game/:id/set-up"
                element={
                  <RouteErrorBoundary
                    domain="set-up"
                    fallbackMessage="The game set up encountered an error. Try reloading the game."
                  >
                    <GameSetup />
                  </RouteErrorBoundary>}
              />
              <Route
                path="/game/:id/music"
                element={
                  <RouteErrorBoundary
                    domain="music-phase"
                    fallbackMessage="The music phase encountered an error. Try reloading to continue the game."
                  >
                    <MusicPhase />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/game/:id/vote"
                element={
                  <RouteErrorBoundary
                    domain="voting-phase"
                    fallbackMessage="The voting phase encountered an error. Try reloading to continue the game."
                  >
                    <VotingPhase />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/game/:id/guess"
                element={
                  <RouteErrorBoundary
                    domain="guessing-phase"
                    fallbackMessage="The guessing phase encountered an error. Try reloading to continue the game."
                  >
                    <GuessingPhase />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/game/:id/results"
                element={
                  <RouteErrorBoundary
                    domain="results-phase"
                    fallbackMessage="The results phase encountered an error. Try reloading to continue the game."
                  >
                    <Results />
                  </RouteErrorBoundary>
                }
              />
            </Routes>
          </GameProvider>
        </AppErrorBoundary>
      </BrowserRouter>
    </CookiesProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
