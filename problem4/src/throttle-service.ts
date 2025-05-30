import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import path from "path";
import {
  CallRequest,
  ThrottleResponse,
  EchoResponse,
  QueuedRequest,
  ThrottleServiceHealth,
} from "./types/common";

const app = express();
const PORT: number = parseInt(process.env.PORT || "3001");
const ECHO_SERVICE_URL: string = "http://localhost:3002";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Throttling configuration
const THROTTLE_LIMIT: number = 4096; // calls per minute to Echo Service
const WINDOW_SIZE: number = 60000; // 1 minute in milliseconds

// Queue and throttling state
let requestQueue: QueuedRequest[] = [];
let callsThisMinute: number = 0;
let windowStart: number = Date.now();
let processing: boolean = false;

// Logging utility
function logToFile(message: string): void {
  const timestamp: string = new Date().toISOString();
  const logMessage: string = `[${timestamp}] ${message}\n`;
  const logPath: string = path.join(
    __dirname,
    "..",
    "logs",
    "throttle-service.log"
  );

  // Ensure logs directory exists
  const logsDir: string = path.dirname(logPath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  fs.appendFileSync(logPath, logMessage);
  console.log(`Throttle Service: ${message}`);
}

// Reset throttle window if needed
function resetWindowIfNeeded(): void {
  const now: number = Date.now();
  if (now - windowStart >= WINDOW_SIZE) {
    callsThisMinute = 0;
    windowStart = now;
    logToFile(
      `Throttle window reset - New window started at ${new Date(
        windowStart
      ).toISOString()}`
    );
  }
}

// Process request queue
async function processQueue(): Promise<void> {
  if (processing) return;
  processing = true;

  while (requestQueue.length > 0) {
    resetWindowIfNeeded();

    if (callsThisMinute >= THROTTLE_LIMIT) {
      logToFile(
        `Throttle limit reached (${callsThisMinute}/${THROTTLE_LIMIT}). Waiting for next window...`
      );
      // Wait for next window
      const timeToWait: number = WINDOW_SIZE - (Date.now() - windowStart);
      if (timeToWait > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, timeToWait));
        resetWindowIfNeeded();
      }
    }

    if (requestQueue.length === 0) break;

    const queuedItem: QueuedRequest = requestQueue.shift()!;
    const { id, message }: CallRequest = queuedItem.request.body;

    try {
      callsThisMinute++;
      const forwardTime: string = new Date().toISOString();

      logToFile(
        `Forwarding to Echo Service - ID: ${id}, Calls this minute: ${callsThisMinute}/${THROTTLE_LIMIT}, Message: "${message}"`
      );

      // Forward to Echo Service
      const echoResponse: AxiosResponse<EchoResponse> = await axios.post(
        `${ECHO_SERVICE_URL}/echo`,
        {
          id: id,
          message: message,
        }
      );

      const responseTime: string = new Date().toISOString();
      logToFile(
        `Received response from Echo Service - ID: ${id}, Response time: ${responseTime}`
      );

      // Send response back to caller
      const throttleResponse: ThrottleResponse = {
        ...echoResponse.data,
        throttleInfo: {
          forwarded: true,
          forwardTime: forwardTime,
          responseTime: responseTime,
          callsThisMinute: callsThisMinute,
          throttleLimit: THROTTLE_LIMIT,
        },
      };

      queuedItem.response.json(throttleResponse);
    } catch (error: any) {
      logToFile(
        `Error forwarding to Echo Service - ID: ${id}, Error: ${error.message}`
      );
      const errorResponse: Partial<ThrottleResponse> = {
        id: id,
        originalMessage: message,
        response: "Service Error",
        rateLimitExceeded: false,
        currentCalls: 0,
        limit: 0,
        throttleInfo: {
          forwarded: false,
          callsThisMinute: callsThisMinute,
          throttleLimit: THROTTLE_LIMIT,
        },
      };

      queuedItem.response.status(500).json({
        error: "Failed to forward request to Echo Service",
        ...errorResponse,
      });
    }

    // Small delay to prevent overwhelming
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
  }

  processing = false;
  logToFile(`Queue processing completed. Queue length: ${requestQueue.length}`);
}

// Health check
app.get("/health", (req: Request, res: Response): void => {
  resetWindowIfNeeded();
  const healthResponse: ThrottleServiceHealth = {
    status: "Throttle Service is running",
    port: PORT,
    throttleLimit: `${THROTTLE_LIMIT} calls per minute`,
    currentWindow: {
      calls: callsThisMinute,
      windowStart: new Date(windowStart).toISOString(),
    },
    queueLength: requestQueue.length,
    echoServiceUrl: ECHO_SERVICE_URL,
  };

  res.json(healthResponse);
});

// Throttle endpoint - receives calls from Caller Service
app.post(
  "/throttle",
  (
    req: Request<{}, ThrottleResponse, CallRequest>,
    res: Response<ThrottleResponse>
  ): void => {
    const { id, message }: CallRequest = req.body;
    const requestTime: string = new Date().toISOString();

    logToFile(
      `Received request from Caller Service - ID: ${id}, Message: "${message}", Queue length: ${requestQueue.length}`
    );

    // Add to queue
    const queuedRequest: QueuedRequest = {
      request: {
        body: { id, message },
      },
      response: res,
    };

    requestQueue.push(queuedRequest);

    logToFile(
      `Request queued - ID: ${id}, New queue length: ${requestQueue.length}`
    );

    // Start processing if not already running
    processQueue().catch((error: Error) => {
      logToFile(`Error in queue processing: ${error.message}`);
    });
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
  const startMessage: string = `Throttle Service started on port ${PORT} with throttle limit of ${THROTTLE_LIMIT} calls per minute to Echo Service`;
  logToFile(startMessage);
  console.log(`Throttle Service endpoints:`);
  console.log(`  GET    /health`);
  console.log(`  POST   /throttle`);
  console.log(`  Forwards to: ${ECHO_SERVICE_URL}/echo`);
});

export default app;
