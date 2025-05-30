interface LoadingSpinnerProps {
  type?: "default" | "table";
}

export default function LoadingSpinner({
  type = "default",
}: LoadingSpinnerProps) {
  if (type === "table") {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="px-4 sm:px-6 py-4 border-b border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-12 text-center">
      <div className="inline-flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    </div>
  );
}
