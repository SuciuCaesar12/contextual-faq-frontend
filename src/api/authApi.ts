import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api", 
  headers: {
    'Content-Type': 'application/json',
  },
});

interface LoginResponse {
  user_id: number;
  role: "ADMIN" | "USER";
  access_token: string;
  token_type: string;
  expiry: string; // ISO 8601 string
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/user/login", {
      username,
      password,
      role: 'USER'
    });

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const registerUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/user/register", {
      username,
      password,
      role: 'USER'
    });
    return response.data;
  } catch (error) {
    throw new Error("Registration failed");
  }
};
