import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lwphsims-uat.up.railway.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp && Date.now() >= payload.exp * 1000;
  } catch (e) {
    return true; // If token is not a valid JWT, consider it expired
  }
};

// Function to handle session expiration
export const handleSessionExpiration = () => {
  // Clear all auth-related data
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAuthenticated');

  // Dispatch a custom event to show the session expired modal
  window.dispatchEvent(new Event('session-expired'));
};

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Check if token exists and is not expired
  if (token) {
    if (isTokenExpired(token)) {
      handleSessionExpiration();
      return Promise.reject('Token expired');
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleSessionExpiration();
    }
    return Promise.reject(error);
  }
);

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

// Debug function to test product creation API
export async function debugCreateProduct() {
  try {
    const response = await fetch('https://lwphsims-uat.up.railway.app/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category_ext_id: "U0vVtwrZQt",
        brand_ext_id: "FP5Llawmk9",
        name: "Sample Product",
        material: "Leather",
        hardware: "Metal",
        code: "PRD123",
        measurement: "10x20",
        model: "Model-X",
        auth_ext_id: "7sALGjWK6F",
        inclusion: ["Dust Bag", "Box"],
        images: ["img1.jpg", "img2.jpg"],
        condition: {
          interior: "8",
          exterior: "9",
          overall: "96",
          description: "Minor scratches on the frame"
        },
        stock: {
          min_qty: 1,
          qty_in_stock: 10
        },
        cost: 0,
        price: 180000,
        is_consigned: true,
        consignor_ext_id: "IB5nTFD6d6",
        consignor_selling_price: 140000,
        consigned_date: "2025-04-01",
        created_by: "admin_user"
      })
    });
    const data = await response.json();
    console.log('Product creation response:', data);
    return data;
  } catch (error) {
    console.error('Product creation error:', error);
    throw error;
  }
}

export default api; 