"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "found" | "not-found" | "error"
  >("loading");
  const [originalUrl, setOriginalUrl] = useState<string>("");

  useEffect(() => {
    async function handleRedirect() {
      const key = Array.isArray(params.key) ? params.key[0] : params.key;

      if (!key) {
        setStatus("not-found");
        return;
      }

      console.log("RedirectPage: Handling redirect for key:", key);

      try {
        // Use the API route to get the original URL
        const response = await fetch(`/api/redirect/${key}`);
        const data = await response.json();

        if (response.ok && data.originalUrl) {
          console.log("RedirectPage: Got original URL:", data.originalUrl);
          setOriginalUrl(data.originalUrl);
          setStatus("found");

          // Redirect after a short delay to show the redirect page
          setTimeout(() => {
            window.location.href = data.originalUrl;
          }, 1000);
        } else {
          console.log("RedirectPage: URL not found for key:", key);
          setStatus("not-found");
        }
      } catch (error) {
        console.error("RedirectPage: Error during redirect:", error);
        setStatus("error");
      }
    }

    handleRedirect();
  }, [params.key, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">
            Looking up URL...
          </h1>
        </div>
      </div>
    );
  }

  if (status === "found") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Redirecting...
          </h1>
          <p className="text-gray-600 mb-4">Taking you to:</p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-blue-600 break-all font-mono text-sm">
              {originalUrl}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            If you are not redirected automatically,
            <a
              href={originalUrl}
              className="text-blue-600 hover:underline ml-1"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            URL Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The short URL you&apos;re looking for doesn&apos;t exist or has
            expired.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Short URL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Error</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while looking up this URL.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
