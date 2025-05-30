// Core data types
export interface UrlMapping {
  shortKey: string;
  originalUrl: string;
  createdAt: string;
  accessCount: number;
}

// API Request types
export interface ShortenUrlRequest {
  url: string;
}

// API Response types
export interface ShortenUrlResponse {
  key: string;
  originalUrl: string;
  shortUrl: string;
}

export interface RedirectResponse {
  originalUrl: string;
  shortKey: string;
  accessCount: number;
  createdAt: string;
}

export interface ErrorResponse {
  error: string;
}

// Frontend types
export interface ShortenedUrl {
  originalUrl: string;
  shortKey: string;
  shortUrl: string;
  createdAt: string;
}

// Statistics types
export interface UrlStats {
  totalUrls: number;
  totalClicks: number;
  mostClicked: UrlMapping | null;
}

// Type guards for API responses
export function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response.error === "string";
}

export function isShortenUrlResponse(
  response: any
): response is ShortenUrlResponse {
  return (
    response &&
    typeof response.key === "string" &&
    typeof response.originalUrl === "string" &&
    typeof response.shortUrl === "string"
  );
}

export function isRedirectResponse(
  response: any
): response is RedirectResponse {
  return (
    response &&
    typeof response.originalUrl === "string" &&
    typeof response.shortKey === "string" &&
    typeof response.accessCount === "number" &&
    typeof response.createdAt === "string"
  );
}
