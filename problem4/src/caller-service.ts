import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import path from "path";
import { ThrottleResponse, CallerServiceHealth } from "./types/common";

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000");
const THROTTLE_SERVICE_URL: string = "http://localhost:3001";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Caller state
let currentId: number = 1;
let currentMinute: number = 1;
let totalCalls: number = 0;
let isRunning: boolean = false;

// Logging utility
function logToFile(message: string): void {
  const timestamp: string = new Date().toISOString();
  const logMessage: string = `[${timestamp}] ${message}\n`;
  const logPath: string = path.join(
    __dirname,
    "..",
    "logs",
    "caller-service.log"
  );

  // Ensure logs directory exists
  const logsDir: string = path.dirname(logPath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  fs.appendFileSync(logPath, logMessage);
  console.log(`Caller Service: ${message}`);
}

// Make a single call to throttle service
async function makeCall(id: number): Promise<void> {
  const message: string = id.toString();
  const callStartTime: string = new Date().toISOString();

  logToFile(
    `Making call - ID: ${id}, Message: "${message}", Call start time: ${callStartTime}`
  );

  try {
    const response: AxiosResponse<ThrottleResponse> = await axios.post(
      `${THROTTLE_SERVICE_URL}/throttle`,
      {
        id: id,
        message: message,
      }
    );

    const responseTime: string = new Date().toISOString();
    logToFile(
      `Received response - ID: ${id}, Response time: ${responseTime}, Response: "${response.data.response}", Rate limit exceeded: ${response.data.rateLimitExceeded}`
    );
  } catch (error: any) {
    const errorTime: string = new Date().toISOString();
    logToFile(
      `Call failed - ID: ${id}, Error time: ${errorTime}, Error: ${error.message}`
    );
  }
}

// Execute calls for a specific minute
async function executeMinute(minute: number): Promise<void> {
  const callsToMake: number = Math.pow(16, minute); // 16^n pattern
  const startTime: string = new Date().toISOString();

  logToFile(
    `Starting minute ${minute} - Making ${callsToMake} calls, Start time: ${startTime}`
  );

  const promises: Promise<void>[] = [];

  for (let i = 0; i < callsToMake; i++) {
    promises.push(makeCall(currentId++));
    totalCalls++;
  }

  // Wait for all calls to complete
  await Promise.all(promises);

  const endTime: string = new Date().toISOString();
  logToFile(
    `Completed minute ${minute} - All ${callsToMake} calls finished, End time: ${endTime}`
  );
}

// Execute the full test sequence
async function executeTestSequence(): Promise<void> {
  if (isRunning) {
    logToFile(`Test sequence already running`);
    return;
  }

  isRunning = true;
  currentId = 1;
  currentMinute = 1;
  totalCalls = 0;

  const testStartTime: string = new Date().toISOString();
  logToFile(`Starting full test sequence at ${testStartTime}`);

  try {
    // Execute 4 minutes: 16^1, 16^2, 16^3, 16^4
    for (let minute = 1; minute <= 4; minute++) {
      currentMinute = minute;
      await executeMinute(minute);

      // Wait 1 minute between test phases to allow rate limit window to reset
      if (minute < 4) {
        logToFile(`Waiting 60 seconds before starting minute ${minute + 1}...`);
        await new Promise<void>((resolve) => setTimeout(resolve, 60000));
      }
    }

    const testEndTime: string = new Date().toISOString();
    logToFile(
      `Test sequence completed at ${testEndTime}. Total calls made: ${totalCalls}`
    );
  } catch (error: any) {
    logToFile(`Test sequence failed: ${error.message}`);
  } finally {
    isRunning = false;
  }
}

// Health check
app.get("/health", (req: Request, res: Response): void => {
  const healthResponse: CallerServiceHealth = {
    status: "Caller Service is running",
    port: PORT,
    currentPhase: isRunning
      ? {
          minute: currentMinute,
          callsThisMinute: Math.pow(16, currentMinute),
          totalCalls: totalCalls,
        }
      : undefined,
    throttleServiceUrl: THROTTLE_SERVICE_URL,
  };

  res.json(healthResponse);
});

// Start test sequence endpoint
app.post("/start", (req: Request, res: Response): void => {
  if (isRunning) {
    res.status(400).json({
      error: "Test sequence already running",
      currentPhase: {
        minute: currentMinute,
        callsThisMinute: Math.pow(16, currentMinute),
        totalCalls: totalCalls,
      },
    });
    return;
  }

  logToFile(`Test sequence start requested`);

  // Start the test sequence asynchronously
  executeTestSequence().catch((error: Error) => {
    logToFile(`Error in test sequence: ${error.message}`);
  });

  res.json({
    message: "Test sequence started",
    pattern:
      "Minute 1: 16 calls, Minute 2: 256 calls, Minute 3: 4,096 calls, Minute 4: 65,536 calls",
  });
});

// Status endpoint
app.get("/status", (req: Request, res: Response): void => {
  res.json({
    isRunning: isRunning,
    currentMinute: currentMinute,
    currentId: currentId,
    totalCalls: totalCalls,
    nextCallsCount: isRunning ? Math.pow(16, currentMinute) : null,
    throttleServiceUrl: THROTTLE_SERVICE_URL,
  });
});

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
  const startMessage: string = `Caller Service started on port ${PORT}`;
  logToFile(startMessage);
  console.log(`Caller Service endpoints:`);
  console.log(`  GET    /health`);
  console.log(`  GET    /status`);
  console.log(`  POST   /start`);
  console.log(`  Calls to: ${THROTTLE_SERVICE_URL}/throttle`);
  console.log(`\nCall pattern:`);
  console.log(`  Minute 1: 16 calls (16^1)`);
  console.log(`  Minute 2: 256 calls (16^2)`);
  console.log(`  Minute 3: 4,096 calls (16^3)`);
  console.log(`  Minute 4: 65,536 calls (16^4)`);
});

export default app;
