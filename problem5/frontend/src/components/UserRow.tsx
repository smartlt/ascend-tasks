import { Edit2, Trash2, Mail, Calendar } from "lucide-react";
import { User } from "@/types/user";
import Image from "next/image";
import { useState } from "react";

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <tr key={user._id} className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.avatarUrl && !imageError ? (
              <Image
                className="h-10 w-10 rounded-full object-cover"
                src={user.avatarUrl}
                alt={user.name}
                width={40}
                height={40}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500 sm:hidden">
              Age: {user.age}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.age}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-900">
          <Mail className="w-4 h-4 mr-2 text-gray-400 hidden sm:block" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="text-sm text-gray-500 lg:hidden">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-600 hover:text-white transition-colors"
            title="Edit user"
            aria-label={`Edit ${user.name}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="text-red-600 p-1 rounded hover:bg-red-600 hover:text-white transition-colors"
            title="Delete user"
            aria-label={`Delete ${user.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
