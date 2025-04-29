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
}

const mockUser: UserData = {
  external_id: "123",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  is_active: true,
  created_at: new Date().toISOString(),
  last_login: new Date().toISOString()
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
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = async () => {
    // Remove confirmation dialog, just perform logout
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

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to login page
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      const errorMessage = error.response?.data?.message || "Failed to logout";
      toast.error(errorMessage);
      
      // Even if the API call fails, we should still clear local storage and redirect
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
            last_login: new Date().toISOString()
          });
          
          resolve();
        } else {
          reject(new Error("Invalid verification code"));
        }
      }, 1000);
    });
  };

  // Function for demonstration login
  const login = (credentials: { email: string; password: string }) => {
    // Mock login - replace with actual API call
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          localStorage.setItem("isAuthenticated", "true");
          setUser({
            external_id: "123",
            first_name: "Admin",
            last_name: "User",
            email: credentials.email,
            is_active: true,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
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