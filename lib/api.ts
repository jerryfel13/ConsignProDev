import axios from 'axios';

// Define the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lwphsims-uat.up.railway.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface CreateClientRequest {
  first_name: string;
  last_name: string;
  email: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
}

export interface CreateClientResponse {
  status: {
    success: boolean;
    message: string;
  };
  data: {
    first_name: string;
    last_name: string;
    email: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
    external_id: string;
    updated_at: string;
    last_login: string | null;
    id: number;
    is_active: boolean;
    created_at: string;
    deleted_at: string | null;
  };
}

export interface ApiError {
  status: {
    success: boolean;
    message: string;
  };
}

// Client API functions
export const clientApi = {
  createClient: async (clientData: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    const response = await axios.post(
      `${API_BASE_URL}/clients`,
      clientData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
}; 