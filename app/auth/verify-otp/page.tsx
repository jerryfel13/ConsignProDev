"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Helper function to mask email
function maskEmail(email: string | null): string {
  if (!email) return "your email";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain || localPart.length < 3) return email; // Basic check
  return `${localPart.substring(0, 1)}**********${localPart.substring(
    localPart.length - 1
  )}@${domain}`;
}

// Helper function to format time
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false); // State for resend loading
  const { verifyOtp, sendOtp } = useAuth();

  // Get email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Cleanup interval on component unmount or when timer reaches 0
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyOtp(otp);
      router.push("/dashboard"); // Redirect to dashboard after successful verification
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      setOtp(""); // Clear the OTP input
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending || !userEmail) return;

    setIsResending(true);
    setError(""); // Clear previous errors

    try {
      await sendOtp(userEmail);
      // Reset timer and resend state
      setTimer(300);
      setCanResend(false);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Account Verification
          </CardTitle>
          <CardDescription>
            Verify your account by entering the 6-digit code we sent to{" "}
            <span className="font-medium text-gray-800">
              {maskEmail(userEmail)}
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}

            <div className="text-center text-sm text-gray-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className={`font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${
                    isResending ? "animate-pulse" : ""
                  }`}
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              ) : (
                <span>
                  Didn't receive a code? Resend in{" "}
                  <span className="font-medium text-gray-800">
                    {formatTime(timer)}
                  </span>
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={otp.length !== 6 || isLoading}
              className="w-full h-10"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
