import { User as UserIcon } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="p-12 text-center">
      <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-600">
        {searchQuery
          ? "Try adjusting your search criteria"
          : "Get started by creating your first user"}
      </p>
    </div>
  );
}
