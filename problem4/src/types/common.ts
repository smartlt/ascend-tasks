export interface CallRequest {
  id: number;
  message: string;
}

export interface EchoResponse {
  id: number;
  originalMessage: string;
  response: string;
  rateLimitExceeded: boolean;
  currentCalls: number;
  limit: number;
}

export interface ThrottleResponse extends EchoResponse {
  throttleInfo: {
    forwarded: boolean;
    forwardTime?: string;
    responseTime?: string;
    callsThisMinute: number;
    throttleLimit: number;
  };
}

export interface QueuedRequest {
  request: {
    body: CallRequest;
  };
  response: any;
}

export interface RateLimitWindow {
  calls: number;
  windowStart: string;
}

export interface ServiceHealth {
  status: string;
  port: number;
  currentWindow?: RateLimitWindow;
}

export interface CallerServiceHealth extends ServiceHealth {
  currentPhase?: {
    minute: number;
    callsThisMinute: number;
    totalCalls: number;
  };
  throttleServiceUrl: string;
}

export interface ThrottleServiceHealth extends ServiceHealth {
  throttleLimit: string;
  queueLength: number;
  echoServiceUrl: string;
}

export interface EchoServiceHealth extends ServiceHealth {
  rateLimit: string;
}
