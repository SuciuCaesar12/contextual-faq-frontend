import axios from "axios";
import { Topic, TopicDetails } from "../types/topic";
import { useAuthStore } from "../stores/useAuthStore";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/topic",
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken?.token;
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTopic = async (id: number): Promise<Topic> => {
  try {
    const response = await api.get<Topic>("/", { params: { id } });
    return response.data;
  } catch (error) {
    console.error("Error fetching topic by ID:", error);
    throw error;
  }
};

export const getAllTopics = async (): Promise<Topic[]> => {
  try {
    const response = await api.get<Topic[]>("/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all topics:", error);
    throw error;
  }
};

export const getTopicDetails = async (id: number): Promise<TopicDetails> => {
  try {
    const response = await api.get<TopicDetails>("/details", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching topic details:", error);
    throw error;
  }
};

export const getAllTopicsDetails = async (): Promise<TopicDetails[]> => {
  try {
    const response = await api.get<TopicDetails[]>("/all/details");
    return response.data;
  } catch (error) {
    console.error("Error fetching all topics details:", error);
    throw error;
  }
};

export const createTopic = async (name: string): Promise<TopicDetails> => {
  try {
    const response = await api.post<TopicDetails>("/", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  }
};

export const deleteTopic = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>("/", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting topic:", error);
    throw error;
  }
};

export const getAvailableTopicsForUser = async (
  user_id: number
): Promise<TopicDetails[]> => {
  try {
    const response = await api.get<TopicDetails[]>("/available", {
      params: { user_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching available topics:", error);
    throw error;
  }
};
