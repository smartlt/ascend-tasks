"use client";

import { useState } from "react";
import type {
  ShortenedUrl,
  ShortenUrlResponse,
  ErrorResponse,
} from "@/lib/types";
import { isErrorResponse, isShortenUrlResponse } from "@/lib/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: ShortenUrlResponse | ErrorResponse = await response.json();

      if (response.ok && isShortenUrlResponse(data)) {
        const newShortenedUrl: ShortenedUrl = {
          originalUrl: url.trim(),
          shortKey: data.key,
          shortUrl: `${window.location.origin}/${data.key}`,
          createdAt: new Date().toISOString(),
        };
        setShortenedUrls((prev) => [newShortenedUrl, ...prev]);
        setUrl("");
      } else if (isErrorResponse(data)) {
        setError(data.error);
      } else {
        setError("Failed to shorten URL");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-600">
            Transform long URLs into short, shareable links
          </p>
        </header>

        {/* URL Shortening Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter URL to shorten
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/very-long-url"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Shortening...
                </div>
              ) : (
                "Shorten URL"
              )}
            </button>
          </form>
        </div>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Shortened URLs
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {shortenedUrls.map((item, index) => (
                <div key={index} className="p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Original URL:
                      </p>
                      <p className="text-gray-900 break-all">
                        {item.originalUrl}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Shortened URL:
                      </p>
                      <div className="flex items-center space-x-2">
                        <a
                          href={item.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium break-all flex-1 hover:text-blue-800 hover:underline transition duration-200"
                        >
                          {item.shortUrl}
                        </a>
                        <button
                          onClick={() => copyToClipboard(item.shortUrl)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition duration-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Security & Scalability Considerations
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                🔒 Security Concerns:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>URL validation to prevent malicious redirects</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Blacklist for known malicious domains</li>
                <li>HTTPS enforcement for secure redirects</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                ⚡ Scalability Solutions:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Database indexing on short keys for fast lookups</li>
                <li>Redis caching for frequently accessed URLs</li>
                <li>Load balancing across multiple servers</li>
                <li>CDN integration for global distribution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
