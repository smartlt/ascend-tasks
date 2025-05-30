"use client";

import { useState } from "react";
import { User, CreateUserDto } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";

// Import components
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ErrorMessage from "@/components/ErrorMessage";
import UserTable from "@/components/UserTable";
import UserModal from "@/components/UserModal";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Use the custom hook for all user-related operations
  const {
    users,
    loading,
    error,
    total,
    totalPages,
    startItem,
    endItem,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  } = useUsers({
    searchQuery,
    currentPage,
    itemsPerPage,
  });

  // Form state
  const [formData, setFormData] = useState<CreateUserDto>({
    name: "",
    age: 0,
    email: "",
    avatarUrl: "",
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page
    // The hook will automatically reload when searchQuery changes
  };

  // Handle create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      // Error is already handled by the hook
      console.error("Create user failed:", err);
    }
  };

  // Handle edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser(editingUser._id, formData);
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
    } catch (err) {
      // Error is already handled by the hook
      console.error("Update user failed:", err);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    try {
      await deleteUser(user._id);
    } catch (err) {
      // Error is already handled by the hook
      console.error("Delete user failed:", err);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    clearError(); // Clear any previous errors
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      age: user.age,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
    });
    clearError(); // Clear any previous errors
    setShowEditModal(true);
  };

  // Close modals
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingUser(null);
    resetForm();
    clearError(); // Clear any errors when closing
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", age: 0, email: "", avatarUrl: "" });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // The hook will automatically reload when currentPage changes
  };

  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(0); // Reset to first page when changing limit
    // The hook will automatically reload when itemsPerPage changes
  };

  // Handle search query change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0); // Reset to first page when searching
    // The hook will automatically reload when searchQuery changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddUser={openCreateModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <ErrorMessage message={error} />

        <UserTable
          users={users}
          loading={loading}
          searchQuery={searchQuery}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          itemsPerPage={itemsPerPage}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </main>

      {/* Create User Modal */}
      <UserModal
        isOpen={showCreateModal}
        mode="create"
        formData={formData}
        onClose={closeModals}
        onSubmit={handleCreateUser}
        onFormChange={setFormData}
      />

      {/* Edit User Modal */}
      <UserModal
        isOpen={showEditModal}
        mode="edit"
        formData={formData}
        onClose={closeModals}
        onSubmit={handleEditUser}
        onFormChange={setFormData}
      />
    </div>
  );
}
