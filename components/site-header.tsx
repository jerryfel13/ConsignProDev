"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/auth/login");
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b"
      style={{ backgroundColor: "#989081" }}
    >
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <div className="relative w-full flex-1 max-w-xs sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 rounded-md"
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            asChild
            className="bg-white hover:bg-white/90 shrink-0"
          >
            <Link href="/clients/new">
              <User className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Add Client</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            asChild
            className="bg-white hover:bg-white/90 shrink-0"
          >
            <Link href="/consignments/new">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Add Consignment</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleLogout}
            className="bg-white hover:bg-white/90 shrink-0"
          >
            <LogOut className="h-4 w-4 text-gray-600" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
