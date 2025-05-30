# Problem 4 - Rate and Throttle API (TypeScript)

A complete implementation of three standalone Express.js services with rate limiting and throttling capabilities, written in TypeScript.

## Services Overview

### 1. Caller Service (Port 3000)

- Makes API calls following a 16^n pattern over 4 minutes
- **Minute 1**: 16 calls (16^1)
- **Minute 2**: 256 calls (16^2)
- **Minute 3**: 4,096 calls (16^3)
- **Minute 4**: 65,536 calls (16^4)
- Each call has an incremental ID and contains the ID as the message
- Logs all call timestamps and responses

### 2. Throttle Service (Port 3001)

- Receives calls from Caller Service
- Throttles requests to never exceed 4,096 calls per minute to Echo Service
- Queues excess requests and processes them in the next window
- Logs all throttling events and forwards

### 3. Echo Service (Port 3002)

- Echoes back received messages
- Enforces a 512 calls per minute rate limit
- Responds with "Exceeding Limit" when rate limit is exceeded
- Logs all requests with rate limit information

## Project Structure

```
problem4/
├── src/
│   ├── types/
│   │   └── common.ts          # TypeScript type definitions
│   ├── caller-service.ts      # Caller Service implementation
│   ├── throttle-service.ts    # Throttle Service implementation
│   └── echo-service.ts        # Echo Service implementation
├── dist/                      # Compiled JavaScript (generated)
├── logs/                      # Service logs (generated)
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm

### 1. Install Dependencies

```bash
cd problem4
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

## Running the Services

### Option 1: Development Mode (with hot reload)

Start all services simultaneously:

```bash
npm run dev:all
```

Or start each service individually:

```bash
# Terminal 1 - Echo Service
npm run dev:echo

# Terminal 2 - Throttle Service
npm run dev:throttle

# Terminal 3 - Caller Service
npm run dev:caller
```

### Option 2: Production Mode

Start each service in separate terminals:

```bash
# Terminal 1 - Echo Service
npm run start:echo

# Terminal 2 - Throttle Service
npm run start:throttle

# Terminal 3 - Caller Service
npm run start:caller
```

## API Usage

### Health Checks

```bash
# Check all services
curl http://localhost:3000/health  # Caller Service
curl http://localhost:3001/health  # Throttle Service
curl http://localhost:3002/health  # Echo Service
```

### Start Test Sequence

```bash
# Start the 16^n call pattern
curl -X POST http://localhost:3000/start
```

### Monitor Status

```bash
# Check current status
curl http://localhost:3000/status
```

## Service Details

### Caller Service Endpoints

- `GET /health` - Service health and current phase
- `GET /status` - Current execution status
- `POST /start` - Start the test sequence

### Throttle Service Endpoints

- `GET /health` - Service health and queue status
- `POST /throttle` - Receive calls from Caller Service

### Echo Service Endpoints

- `GET /health` - Service health and rate limit status
- `POST /echo` - Echo endpoint with rate limiting

## Rate Limiting & Throttling Behavior

### Expected Flow:

1. **Minute 1**: 16 calls → All pass through throttle → All reach echo
2. **Minute 2**: 256 calls → All pass through throttle → All reach echo
3. **Minute 3**: 4,096 calls → All pass through throttle → Echo starts limiting after 512
4. **Minute 4**: 65,536 calls → Throttle queues excess → Echo heavily rate limited

### Logging

All services create detailed logs in the `logs/` directory:

- `caller-service.log` - Call attempts and responses
- `throttle-service.log` - Throttling events and queue status
- `echo-service.log` - Rate limit decisions and responses

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Axios** - HTTP client for service communication
- **CORS** - Cross-Origin Resource Sharing
- **Node.js** - Runtime environment

## Configuration

You can adjust the following values in the source files:

**Caller Service:**

- Call pattern: Currently 16^n (modify `Math.pow(16, minute)`)
- Service URL: `THROTTLE_SERVICE_URL`

**Throttle Service:**

- Throttle limit: `THROTTLE_LIMIT` (default: 4,096/minute)
- Service URL: `ECHO_SERVICE_URL`

**Echo Service:**

- Rate limit: `RATE_LIMIT` (default: 512/minute)

## Performance Notes

- The 65,536 calls in minute 4 can be resource intensive
- Monitor system resources during testing
- Logs can grow large during high-volume testing
- Consider adjusting values for your environment if needed

## Troubleshooting

1. **Port conflicts**: Ensure ports 3000, 3001, 3002 are available
2. **Memory issues**: Reduce call volumes if system struggles
3. **Service connectivity**: Ensure all services are running before starting tests
4. **Log permissions**: Ensure write permissions for logs directory

## Example Test Run

```bash
# 1. Start all services
npm run dev:all

# 2. In another terminal, start the test
curl -X POST http://localhost:3000/start

# 3. Monitor progress
curl http://localhost:3000/status

# 4. Check logs
tail -f logs/caller-service.log
tail -f logs/throttle-service.log
tail -f logs/echo-service.log
```
