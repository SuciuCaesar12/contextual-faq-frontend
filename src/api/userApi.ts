// src/api/userApi.ts
import { useAuthStore } from "../stores/useAuthStore";
import { User, UserCredentials, UserRole } from "../types/user";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/user",
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUser = async (userId: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/`, {
      params: { id: userId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

export const getUserDetails = async (
  userId: number
): Promise<UserCredentials> => {
  try {
    const response = await api.get<UserCredentials>(`/details`, {
      params: { id: userId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
};

export const getAllUsersDetails = async (): Promise<UserCredentials[]> => {
  try {
    const response = await api.get<UserCredentials[]>("/all/details");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const createUser = async (username: string, password: string, role: UserRole) => {
  try {
    const response = await api.post<UserCredentials>("/", {
      username,
      password,
      role
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

export const updateUser = async (
  userId: number,
  username: string,
  password: string,
  role: UserRole
): Promise<UserCredentials> => {
  try {
    const response = await api.put<UserCredentials>(`/`, {
      id: userId,
      username,
      password,
      role
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

export const deleteUser = async (
  userId: number
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/`, {
      params: { id: userId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
