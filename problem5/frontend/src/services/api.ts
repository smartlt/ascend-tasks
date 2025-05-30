import axios from "axios";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UsersResponse,
  DeleteResponse,
} from "@/types/user";

const API_BASE_URL = "http://localhost:3000";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class UserService {
  // Get all users with search and pagination
  static async getUsers(
    params: {
      q?: string;
      start?: number;
      limit?: number;
    } = {}
  ): Promise<UsersResponse> {
    const { q, start = 0, limit = 10 } = params;
    const queryParams = new URLSearchParams();

    if (q) queryParams.append("q", q);
    queryParams.append("start", start.toString());
    queryParams.append("limit", limit.toString());

    const response = await api.get<UsersResponse>(`/api/user?${queryParams}`);
    return response.data;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/api/user/${id}`);
    return response.data;
  }

  // Create new user
  static async createUser(userData: CreateUserDto): Promise<User> {
    // Clean the data - remove avatarUrl if it's empty
    const cleanedData = { ...userData };
    if (!cleanedData.avatarUrl || cleanedData.avatarUrl.trim() === "") {
      delete cleanedData.avatarUrl;
    }

    const response = await api.post<User>("/api/user", cleanedData);
    return response.data;
  }

  // Update user by ID
  static async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    // Clean the data - remove avatarUrl if it's empty
    const cleanedData = { ...userData };
    if (!cleanedData.avatarUrl || cleanedData.avatarUrl.trim() === "") {
      delete cleanedData.avatarUrl;
    }

    const response = await api.put<User>(`/api/user/${id}`, cleanedData);
    return response.data;
  }

  // Delete user by ID
  static async deleteUser(id: string): Promise<DeleteResponse> {
    const response = await api.delete<DeleteResponse>(`/api/user/${id}`);
    return response.data;
  }
}

export default api;
