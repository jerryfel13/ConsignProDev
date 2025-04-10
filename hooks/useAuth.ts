"use client";

import { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

// Mock user data - replace with actual authentication implementation
interface User {
  name: string;
  email: string;
  imageUrl: string | null;
  role: string;
  is_admin?: boolean; // Added is_admin property
}

/**
 * Basic auth hook that returns mock user data.
 * TODO: Replace with real authentication logic
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const checkAuth = setTimeout(() => {
      // Check if user is logged in based on localStorage
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      
      if (isAuthenticated) {
        // Mock user data - replace with actual API call
        setUser({
          name: "Admin user",
          email: "admin@example.com",
          imageUrl: null,
          role: "Admin",
          is_admin: true, // Set is_admin to true for testing
        });
      } else {
        setUser(null);
      }
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(checkAuth);
  }, []);

  // Function to handle logout - no router, just local state
  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    // Reset user state
    setUser(null);
    console.log("User logged out"); // Add logging to help debug
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
            name: "Admin User",
            email: email || localStorage.getItem("userEmail") || "user@example.com",
            imageUrl: null,
            role: "Admin",
            is_admin: true, // Set is_admin to true for testing
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
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          localStorage.setItem("isAuthenticated", "true");
          setUser({
            name: "Admin User",
            email: credentials.email,
            imageUrl: null,
            role: "Admin",
            is_admin: true, // Set is_admin to true for testing
          });
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };

  return {
    user,
    loading,
    login,
    logout,
    sendOtp,
    verifyOtp
  };
} 