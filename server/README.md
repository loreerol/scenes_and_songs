# Scenes and Songs - Server

Backend for the Scenes and Songs music game, built with Express.js, GraphQL, and Redis.

## Prerequisites

- **Node.js** 18.13.0
- **Redis** (for game state storage)
- **YouTube API Key** (for video lookups)

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Install and Start Redis

**Install Redis:**
```bash
brew install redis
```

**Start Redis:**
```bash
# Start as background service
brew services start redis

# Or run in foreground
redis-server
```

**Verify Redis is running:**
```bash
redis-cli ping
# Should respond: PONG
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
PORT=3001
```

Get a YouTube API key from [Google Cloud Console](https://console.cloud.google.com/).

## Running the Server

**Development mode (with auto-reload):**
```bash
yarn dev
```

**Production mode:**
```bash
yarn start
```

The server will start on `http://localhost:3001`

## API Endpoints

### GraphQL

**GraphQL Playground:** `http://localhost:3001/graphql`

**Available Queries:**
```graphql
query {
  youtubeVideo(videoId: "dQw4w9WgXcQ") {
    id
    title
    thumbnail
  }
}
```

### REST API

The following REST endpoints are still available during GraphQL migration:

- `GET /api/youtube?id={videoId}` - Get YouTube video details
- `GET /api/games/:gameId/state` - Get game state
- `POST /api/games` - Create new game
- `GET /api/games/:gameId/players` - Get players
- `POST /api/games/:gameId/players` - Join game
- `GET /api/games/:gameId/scenarios` - Get scenarios
- `POST /api/games/:gameId/scenarios` - Create scenarios
- `GET /api/games/:gameId/songs` - Get songs
- `POST /api/games/:gameId/songs` - Submit song
- `GET /api/games/:gameId/votes` - Get votes
- `POST /api/games/:gameId/votes` - Submit vote
- `GET /api/games/:gameId/guess` - Get guesses
- `POST /api/games/:gameId/guess` - Submit guess

### WebSocket

**WebSocket endpoint:** `ws://localhost:3001/ws/player`

Used for real-time game updates (player joins, state changes, etc.)

## Project Structure

```
server/
├── graphql/
│   ├── schema.graphql      # GraphQL type definitions
│   ├── config.js           # GraphQL server config
│   └── resolvers.js        # GraphQL resolver functions
├── endpoints/              # REST API endpoints
│   ├── game.js
│   ├── player.js
│   ├── scenario.js
│   ├── song.js
│   ├── vote.js
│   ├── guess.js
│   └── youtube.js
├── handlers/               # WebSocket message handlers
│   ├── game.js
│   └── player.js
├── index.js                # Main server file
├── package.json
└── .env                    # Environment variables (create this)
```

## Troubleshooting

**Redis connection errors:**
```
Error: connect ECONNREFUSED ::1:6379
```
**Solution:** Start Redis with `brew services start redis`

**Port already in use:**
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:** Kill the process using port 3001:
```bash
lsof -ti:3001 | xargs kill -9
```

**YouTube API errors:**
```
Error: Failed to fetch video details
```
**Solution:** Check that your `YOUTUBE_API_KEY` is valid in `.env`

## Development Notes

This project is being migrated from REST to GraphQL. Currently:
- ✅ YouTube endpoint converted to GraphQL
- 🔄 Other endpoints still using REST (will be migrated)
- ✅ Both REST and GraphQL work simultaneously