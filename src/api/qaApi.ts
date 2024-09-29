import axios from "axios";
import { QA } from "../types/qa";
import { useAuthStore } from "../stores/useAuthStore";

const apiUrl = process.env.REACT_APP_API_URL;
// Initialize Axios instance with base URL
const api = axios.create({
  // baseURL: "http://localhost:8000/api/qa", // Replace with your backend base URL
  baseURL: apiUrl + "/api/qa",
});

// Add Axios request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header if available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Payload for creating a QA
interface CreateQAPayload {
  chat_id: number;
  question: string;
  q_timestamp: Date;
  topic_name: string;
}

// API: Create QA (Protected Route)
export const createQA = async (qa: CreateQAPayload): Promise<QA> => {
  try {
    // Convert `q_timestamp` to a valid string format
    const qaPayload = {
      ...qa,
      q_timestamp: qa.q_timestamp.toISOString(),
    };

    // Send POST request to backend to create QA
    const response = await api.post<QA>("/", qaPayload);
    return response.data;
  } catch (error) {
    console.error("Error creating QA:", error);
    throw error;
  }
};
