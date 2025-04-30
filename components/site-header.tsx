"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Package,
  Search,
  User,
  UserCircle,
  Repeat,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook

// Placeholder user data - REMOVED
// const userData = {
//   name: "Jan Andrei LGU",
//   email: "jan.lgu@example.com",
//   initials: "JA",
//   imageUrl: null, // Add URL if available
//   role: "Member",
// };

export function SiteHeader() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [showBackdrop, setShowBackdrop] = useState(false);

  const handleLogout = () => {
    setShowBackdrop(true);
    const toastId = toast(
      <div className="px-5 py-4 flex flex-col items-center bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h4 className="text-center font-medium text-lg text-gray-900 mb-1">
          Confirm Logout
        </h4>
        <p className="text-center text-gray-600 mb-4">
          Are you sure you want to log out? You will be redirected to the login
          screen.
        </p>
        <div className="flex w-full gap-3">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              setShowBackdrop(false);
            }}
            className="flex-1 py-2 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition-colors"
          >
            No
          </button>
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              setShowBackdrop(false);
              try {
                await logout();
                router.push("/auth/login");
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false,
        className: "!bg-transparent !shadow-none !p-0 !rounded-none",
        onClose: () => setShowBackdrop(false),
      }
    );
  };

  return (
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => {
            toast.dismiss();
            setShowBackdrop(false);
          }}
        />
      )}
      <header
        className="sticky top-0 z-40 w-full border-b"
        style={{ backgroundColor: "#989081" }}
      >
        <div className="flex h-16 items-center w-full px-2 md:px-4">
          <MainNav />
          <div className="flex items-center ml-auto">
            {isLoading ? (
              <div className="h-8 w-8 md:h-10 md:w-24 bg-muted/20 rounded-full animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 md:h-10 w-auto px-0 md:px-2 space-x-0 md:space-x-2 rounded-full hover:bg-muted/10"
                  >
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarImage
                        alt={user.first_name ?? "User"}
                      />
                      <AvatarFallback>
                        {user.first_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium leading-none text-black">
                        {user.first_name ?? "-"}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[calc(100vw-1rem)] sm:w-56 dropdown-menu-content"
                  align="end"
                  sideOffset={8}
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-black">
                        {user.first_name ?? "User"}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email ?? "-"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="dropdown-menu-item">
                    <Link
                      href="/profile"
                      className="flex items-center text-black w-full"
                    >
                      <UserCircle className="mr-2 h-4 w-4 text-gray-700" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="dropdown-menu-item">
                        <Link
                          href="/users/create"
                          className="flex items-center text-black w-full"
                        >
                          <Users className="mr-2 h-4 w-4 text-gray-700" />
                          <span>Create User</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="dropdown-menu-item text-black"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-gray-700" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>
      <ToastContainer />
    </>
  );
}
