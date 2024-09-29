// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request/response interceptors here if needed
export default axiosInstance;
