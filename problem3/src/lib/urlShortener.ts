import { UrlMapping, UrlStats } from "./types";
import connectDB from "./mongodb";
import Url from "./models/Url";

// Characters used for generating short keys
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const KEY_LENGTH = 6;

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

/**
 * Generates a random short key
 */
function generateShortKey(): string {
  let result = "";
  for (let i = 0; i < KEY_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

/**
 * Creates a short URL and stores the mapping in MongoDB
 */
export async function createShortUrl(originalUrl: string): Promise<string> {
  await connectDB();

  console.log("createShortUrl: Creating short URL for:", originalUrl);

  // Check if URL already exists
  const existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) {
    console.log("createShortUrl: Found existing key:", existingUrl.shortKey);
    return existingUrl.shortKey;
  }

  // Generate a unique short key
  let shortKey: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    shortKey = generateShortKey();
    attempts++;

    if (attempts > maxAttempts) {
      throw new Error("Unable to generate unique short key");
    }

    // Check if key already exists in database
    const existing = await Url.findOne({ shortKey });
    if (!existing) break;
  } while (attempts < maxAttempts);

  // Create and save the mapping
  const urlMapping = new Url({
    shortKey,
    originalUrl,
    createdAt: new Date().toISOString(),
    accessCount: 0,
  });

  await urlMapping.save();
  console.log("createShortUrl: Stored mapping with key:", shortKey);

  return shortKey;
}

/**
 * Retrieves the original URL from a short key and increments access count
 */
export async function getOriginalUrl(
  shortKey: string
): Promise<UrlMapping | null> {
  await connectDB();

  console.log("getOriginalUrl: Looking for key:", shortKey);

  // Find and update access count in one operation
  const mapping = await Url.findOneAndUpdate(
    { shortKey },
    { $inc: { accessCount: 1 } },
    { new: true } // Return updated document
  );

  if (mapping) {
    console.log("getOriginalUrl: Found mapping:", mapping.toObject());
    return mapping.toObject();
  } else {
    console.log("getOriginalUrl: No mapping found for key:", shortKey);
  }

  return null;
}

/**
 * Gets all URL mappings (for admin purposes)
 */
export async function getAllMappings(): Promise<UrlMapping[]> {
  await connectDB();

  const mappings = await Url.find({}).sort({ createdAt: -1 });
  return mappings.map((mapping) => mapping.toObject());
}

/**
 * Deletes a URL mapping
 */
export async function deleteMapping(shortKey: string): Promise<boolean> {
  await connectDB();

  const result = await Url.deleteOne({ shortKey });
  return result.deletedCount > 0;
}

/**
 * Gets statistics about URL usage
 */
export async function getStats(): Promise<UrlStats> {
  await connectDB();

  const totalUrls = await Url.countDocuments();

  // Get total clicks
  const clicksResult = await Url.aggregate([
    { $group: { _id: null, totalClicks: { $sum: "$accessCount" } } },
  ]);
  const totalClicks = clicksResult[0]?.totalClicks || 0;

  // Get most clicked URL
  const mostClicked = await Url.findOne({}).sort({ accessCount: -1 });

  return {
    totalUrls,
    totalClicks,
    mostClicked: mostClicked ? mostClicked.toObject() : null,
  };
}
