import { NextRequest, NextResponse } from "next/server";
import { createShortUrl, isValidUrl } from "@/lib/urlShortener";
import type {
  ShortenUrlRequest,
  ShortenUrlResponse,
  ErrorResponse,
} from "@/lib/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ShortenUrlResponse | ErrorResponse>> {
  try {
    const body: ShortenUrlRequest = await request.json();
    const { url } = body;

    // Validate input
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          error: "URL is required and must be a string",
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // Validate URL format
    if (!isValidUrl(trimmedUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format" } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // Security check - prevent some common malicious patterns
    const maliciousPatterns = [
      "javascript:",
      "data:",
      "vbscript:",
      "about:",
      "chrome:",
      "file:",
    ];

    const lowerUrl = trimmedUrl.toLowerCase();
    if (maliciousPatterns.some((pattern) => lowerUrl.startsWith(pattern))) {
      return NextResponse.json(
        { error: "URL scheme not allowed" } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // Create short URL using MongoDB
    const shortKey = await createShortUrl(trimmedUrl);

    const response: ShortenUrlResponse = {
      key: shortKey,
      originalUrl: trimmedUrl,
      shortUrl: `${
        request.headers.get("origin") || "http://localhost:80"
      }/${shortKey}`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      { error: "Failed to create short URL" } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}
