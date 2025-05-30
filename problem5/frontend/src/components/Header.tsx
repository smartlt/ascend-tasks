import { Plus } from "lucide-react";

interface HeaderProps {
  onAddUser: () => void;
}

export default function Header({ onAddUser }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and organize user accounts
            </p>
          </div>
          <button
            onClick={onAddUser}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>
      </div>
    </header>
  );
}
