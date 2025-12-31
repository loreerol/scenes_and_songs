# Scenes & Songs - Client

A multiplayer music trivia game where players submit YouTube songs for scenarios, vote on the best matches, and guess who submitted the winning songs.

## Prerequisites

- Node.js (v16 or higher)
- yarn or npm
- YouTube Data API v3 key (see setup below)

## Installation

```bash
# Install dependencies
yarn install
# or
npm install
```

## YouTube API Setup

The app uses the YouTube Data API to fetch video titles.

### 1. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure the API Key

Create a `.env` file in the `client` folder:

```bash
REACT_APP_YOUTUBE_API_KEY=your_api_key_here
```

**Note:** The API key is rate-limited. If you see "Unknown Title" instead of video names, you may have hit the quota.

## Running the App

```bash
# Development mode
yarn start
# or
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

**Important:** The backend server must be running on `localhost:3001` for the app to work.

## Available Scripts

### `yarn start`
Runs the app in development mode with hot reload.

### `yarn build`
Builds the app for production to the `build` folder.

### `yarn test`
Runs the test suite.

## Tech Stack

- React 18
- TypeScript
- React Query (TanStack Query)
- React Router v6
- WebSocket (react-use-websocket)
- Tailwind CSS
- YouTube iframe API

## Troubleshooting

**Problem:** "Unknown Title" shown for videos
**Solution:** Check your YouTube API key in `.env` and verify you haven't exceeded quota

**Problem:** Can't connect to game
**Solution:** Ensure backend server is running on `localhost:3001`

**Problem:** Real-time updates not working
**Solution:** Check WebSocket connection - backend must support WebSocket on port 3001
