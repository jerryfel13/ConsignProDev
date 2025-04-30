"use client";

import { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Mock user data - replace with actual authentication implementation
interface UserData {
  external_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login: string;
  role: 'admin' | 'user';
}

const mockUser: UserData = {
  external_id: "123",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  is_active: true,
  created_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
  role: 'admin'
};

/**
 * Basic auth hook that returns mock user data.
 * TODO: Replace with real authentication logic
 */
export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userData || !userEmail) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Always set user_external_id on page load if available
      if (parsedUser.external_id) {
        localStorage.setItem("user_external_id", parsedUser.external_id);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      // Call the logout API
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error: any) {
      // If 401, ignore and proceed to clear session
      if (error.response && error.response.status === 401) {
        console.warn('Session already expired or unauthorized.');
      } else {
        console.error("Logout error:", error);
        // Optionally show a toast for other errors
        // const errorMessage = error.response?.data?.message || "Failed to logout";
        // toast.error(errorMessage);
      }
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");
      router.push("/auth/login");
    }
  };

  // Function for sending OTP
  const sendOtp = async (email: string) => {
    // Mock sending OTP - replace with actual API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && email.includes('@')) {
          // Store email for OTP verification page
          localStorage.setItem("userEmail", email);
          // In a real implementation, this would call an API to send the OTP
          console.log("Sending OTP to:", email);
          resolve();
        } else {
          reject(new Error("Invalid email address"));
        }
      }, 1000);
    });
  };

  // Function for verifying OTP
  const verifyOtp = async (otp: string, email?: string) => {
    // Mock OTP verification - replace with actual API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Demo code - in production this would validate against a real OTP
        if (otp === "123456") {
          localStorage.setItem("isAuthenticated", "true");
          
          // Set user data after successful verification
          setUser({
            external_id: "123",
            first_name: "Admin",
            last_name: "User",
            email: email || localStorage.getItem("userEmail") || "user@example.com",
            is_active: true,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            role: 'admin'
          });
          
          resolve();
        } else {
          reject(new Error("Invalid verification code"));
        }
      }, 1000);
    });
  };

  // Function for demonstration login
  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    return new Promise<void>(async (resolve, reject) => {
      try {
        // Replace this with your real API call
        const response = await axios.post('/api/auth/login', credentials);
        const apiUser = response.data.data;
        // Save user info to localStorage
        localStorage.setItem("user_external_id", apiUser.external_id);
        localStorage.setItem("userData", JSON.stringify(apiUser));
        localStorage.setItem("userEmail", apiUser.email);
        // Set user state (flatten role to string)
        setUser({
          external_id: apiUser.external_id,
          first_name: apiUser.first_name,
          last_name: apiUser.last_name,
          email: apiUser.email,
          is_active: apiUser.is_active,
          created_at: apiUser.created_at,
          last_login: apiUser.last_login,
          role: apiUser.role?.name === 'Admin' ? 'admin' : 'user',
        });
        setIsLoading(false);
        resolve();
      } catch (error) {
        setIsLoading(false);
        reject(new Error("Invalid credentials"));
      }
    });
  };

  return {
    user,
    isLoading,
    login,
    logout,
    sendOtp,
    verifyOtp
  };
} 