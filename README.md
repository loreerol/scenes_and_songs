# Scenes and Songs 🎮🎵

Hackathon 2025!

## Prerequisites

Install Redis (one-time setup):
```bash
sudo apt-get update && sudo apt-get install -y redis-server
```

## Development

Start each service in a separate terminal:

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
```

**Terminal 3 - Frontend:**
```bash
cd client
npm start
```

The app will be available at: **http://localhost:3000**

## Ports

- **Redis**: 6379
- **Backend**: 3001 (API & WebSocket)
- **Frontend**: 3000
