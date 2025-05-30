import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { CallRequest, EchoResponse, EchoServiceHealth } from "./types/common";

const app = express();
const PORT: number = parseInt(process.env.PORT || "3002");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting tracking
let callCount: number = 0;
let windowStart: number = Date.now();
const RATE_LIMIT: number = 512; // calls per minute
const WINDOW_SIZE: number = 60000; // 1 minute in milliseconds

// Logging utility
function logToFile(message: string): void {
  const timestamp: string = new Date().toISOString();
  const logMessage: string = `[${timestamp}] ${message}\n`;
  const logPath: string = path.join(
    __dirname,
    "..",
    "logs",
    "echo-service.log"
  );

  // Ensure logs directory exists
  const logsDir: string = path.dirname(logPath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  fs.appendFileSync(logPath, logMessage);
  console.log(`Echo Service: ${message}`);
}

// Rate limiting check
function checkRateLimit(): boolean {
  const now: number = Date.now();

  // Reset window if needed
  if (now - windowStart >= WINDOW_SIZE) {
    callCount = 0;
    windowStart = now;
  }

  callCount++;
  const isExceeding: boolean = callCount > RATE_LIMIT;

  logToFile(
    `Rate limit check - Current: ${callCount}/${RATE_LIMIT}, Window start: ${new Date(
      windowStart
    ).toISOString()}, Exceeding: ${isExceeding}`
  );

  return isExceeding;
}

// Health check
app.get("/health", (req: Request, res: Response): void => {
  const healthResponse: EchoServiceHealth = {
    status: "Echo Service is running",
    port: PORT,
    rateLimit: `${RATE_LIMIT} calls per minute`,
    currentWindow: {
      calls: callCount,
      windowStart: new Date(windowStart).toISOString(),
    },
  };

  res.json(healthResponse);
});

// Echo endpoint
app.post(
  "/echo",
  (
    req: Request<{}, EchoResponse, CallRequest>,
    res: Response<EchoResponse>
  ): void => {
    const { id, message }: CallRequest = req.body;
    const requestTime: string = new Date().toISOString();

    logToFile(`Received request - ID: ${id}, Message: "${message}"`);

    // Check rate limit
    const isExceeding: boolean = checkRateLimit();

    let response: EchoResponse;
    if (isExceeding) {
      response = {
        id: id,
        originalMessage: message,
        response: "Exceeding Limit",
        rateLimitExceeded: true,
        currentCalls: callCount,
        limit: RATE_LIMIT,
      };
      logToFile(
        `Rate limit exceeded - Responding with "Exceeding Limit" for ID: ${id}`
      );
    } else {
      response = {
        id: id,
        originalMessage: message,
        response: message, // Echo back the message
        rateLimitExceeded: false,
        currentCalls: callCount,
        limit: RATE_LIMIT,
      };
      logToFile(`Echoing back message for ID: ${id} - "${message}"`);
    }

    const responseTime: string = new Date().toISOString();
    logToFile(
      `Sending response - ID: ${id}, Response time: ${responseTime}, Rate info: ${callCount}/${RATE_LIMIT}`
    );

    res.json(response);
  }
);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  const errorMessage: string = `Error: ${err.message}`;
  logToFile(errorMessage);
  res.status(500).json({ error: "Internal server error" } as any);
});

// 404 handler
app.use("*", (req: Request, res: Response): void => {
  logToFile(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" } as any);
});

// Start server
app.listen(PORT, (): void => {
  const startMessage: string = `Echo Service started on port ${PORT} with rate limit of ${RATE_LIMIT} calls per minute`;
  logToFile(startMessage);
  console.log(`Echo Service endpoints:`);
  console.log(`  GET    /health`);
  console.log(`  POST   /echo`);
});

export default app;
