import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { Chat, ChatDetails, ChatDetailsWithQAs } from "../types/chat";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/chat",
});

// Add Axios request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getChat = async (id: number): Promise<Chat> => {
  try {
    const response = await api.get<Chat>("/", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};

export const getChatDetails = async (id: number): Promise<ChatDetails> => {
  try {
    const response = await api.get<ChatDetails>("/details", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat details:", error);
    throw error;
  }
};

export const getChatDetailsWithQAs = async (
  id: number
): Promise<ChatDetailsWithQAs> => {
  try {
    const response = await api.get<ChatDetailsWithQAs>("/details/qas", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
};

export const getAllChatsByUser = async (
  user_id: number
): Promise<ChatDetails[]> => {
  try {
    const response = await api.get<ChatDetails[]>("/user-all/details", {
      params: { user_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all chats by user:", error);
    throw error;
  }
};

export const getAllChatsDetails = async (): Promise<ChatDetails[]> => {
  try {
    const response = await api.get<ChatDetails[]>("/all/details");
    return response.data;
  } catch (error) {
    console.error("Error fetching all chats:", error);
    throw error;
  }
};

export const createChat = async (
  user_id: number,
  topic_id: number
): Promise<ChatDetails> => {
  try {
    const response = await api.post<ChatDetails>("/", { user_id, topic_id });
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const deleteChat = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>("/", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};
