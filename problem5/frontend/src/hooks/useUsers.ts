import { useState, useEffect, useCallback } from "react";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { UserService } from "@/services/api";

interface UseUsersParams {
  searchQuery?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

interface UseUsersReturn {
  // State
  users: User[];
  loading: boolean;
  error: string;
  total: number;
  totalPages: number;
  startItem: number;
  endItem: number;

  // Actions
  loadUsers: () => Promise<void>;
  createUser: (userData: CreateUserDto) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserDto) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export function useUsers({
  searchQuery = "",
  currentPage = 0,
  itemsPerPage = 10,
}: UseUsersParams = {}): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrorState] = useState("");
  const [total, setTotal] = useState(0);

  // Calculate pagination values
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, total);

  // Load users from API
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setErrorState("");

      const response = await UserService.getUsers({
        q: searchQuery || undefined,
        start: currentPage * itemsPerPage,
        limit: itemsPerPage,
      });

      setUsers(response.users);
      setTotal(response.total);
    } catch (err) {
      console.error("Failed to load users:", err);
      setErrorState((err as Error)?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, itemsPerPage]);

  // Create new user
  const createUser = useCallback(
    async (userData: CreateUserDto) => {
      try {
        setErrorState("");
        await UserService.createUser(userData);
        await loadUsers(); // Refresh the list
      } catch (err) {
        const errorMessage = (err as Error)?.message || "Failed to create user";
        setErrorState(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [loadUsers]
  );

  // Update existing user
  const updateUser = useCallback(
    async (id: string, userData: UpdateUserDto) => {
      try {
        setErrorState("");
        await UserService.updateUser(id, userData);
        await loadUsers(); // Refresh the list
      } catch (err) {
        const errorMessage = (err as Error)?.message || "Failed to update user";
        setErrorState(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [loadUsers]
  );

  // Delete user
  const deleteUser = useCallback(
    async (id: string) => {
      try {
        setErrorState("");
        await UserService.deleteUser(id);
        await loadUsers(); // Refresh the list
      } catch (err) {
        const errorMessage = (err as Error)?.message || "Failed to delete user";
        setErrorState(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [loadUsers]
  );

  // Clear error
  const clearError = useCallback(() => {
    setErrorState("");
  }, []);

  // Set error
  const setError = useCallback((error: string) => {
    setErrorState(error);
  }, []);

  // Load users when dependencies change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    // State
    users,
    loading,
    error,
    total,
    totalPages,
    startItem,
    endItem,

    // Actions
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    setError,
  };
}
