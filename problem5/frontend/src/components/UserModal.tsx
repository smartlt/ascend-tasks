import { CreateUserDto } from "@/types/user";
import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formData: CreateUserDto;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: CreateUserDto) => void;
}

export default function UserModal({
  isOpen,
  mode,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}: UserModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const title = mode === "create" ? "Create New User" : "Edit User";
  const submitText = mode === "create" ? "Create User" : "Save Changes";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                autoFocus
                value={formData.name}
                onChange={(e) =>
                  onFormChange({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age *
              </label>
              <input
                id="age"
                type="number"
                required
                min="1"
                max="150"
                value={formData.age || ""}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    age: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  onFormChange({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Avatar URL
              </label>
              <input
                id="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={(e) =>
                  onFormChange({ ...formData, avatarUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
