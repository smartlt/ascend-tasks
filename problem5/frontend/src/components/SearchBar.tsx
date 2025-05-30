import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <form onSubmit={onSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}
