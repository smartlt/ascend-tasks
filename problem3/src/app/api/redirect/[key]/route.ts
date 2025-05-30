import { NextRequest, NextResponse } from "next/server";
import { getOriginalUrl } from "@/lib/urlShortener";
import type { ErrorResponse } from "@/lib/types";

interface SuccessResponse {
  originalUrl: string;
  key: string;
  accessCount: number;
}

export async function GET(
  request: NextRequest,
  context: { params: { key: string } }
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { key } = context.params;

    console.log("API redirect route: Looking for key:", key);

    // Get original URL from MongoDB
    const mapping = await getOriginalUrl(key);

    if (!mapping) {
      console.log("API redirect route: No mapping found for key:", key);
      return NextResponse.json(
        { error: "URL not found" } satisfies ErrorResponse,
        { status: 404 }
      );
    }

    console.log("API redirect route: Found mapping:", mapping);

    return NextResponse.json(
      {
        originalUrl: mapping.originalUrl,
        key: mapping.shortKey,
        accessCount: mapping.accessCount,
      } satisfies SuccessResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in redirect API:", error);
    return NextResponse.json(
      { error: "Internal server error" } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}
