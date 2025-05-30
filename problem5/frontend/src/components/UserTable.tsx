import { User } from "@/types/user";
import UserRow from "./UserRow";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

interface UserTableProps {
  users: User[];
  loading: boolean;
  searchQuery: string;
  total: number;
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  itemsPerPage: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function UserTable({
  users,
  loading,
  searchQuery,
  total,
  currentPage,
  totalPages,
  startItem,
  endItem,
  itemsPerPage,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
}: UserTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Table Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({total} total)
          </h2>
          <span className="text-sm text-gray-600">
            Showing {total > 0 ? startItem : 0}-{endItem} of {total}
          </span>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <LoadingSpinner type="table" />
      ) : users.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startItem={startItem}
        endItem={endItem}
        total={total}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
