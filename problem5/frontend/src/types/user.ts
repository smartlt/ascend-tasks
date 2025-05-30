export interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  age: number;
  email: string;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  name?: string;
  age?: number;
  email?: string;
  avatarUrl?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  start: number;
  limit: number;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export type SortField = "name" | "age" | "email" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
