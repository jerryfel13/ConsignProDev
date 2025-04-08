"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center space-x-4 sm:justify-end">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients or consignments..."
              className="pl-8 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            asChild
            className="bg-white hover:bg-white/90"
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
            className="bg-white hover:bg-white/90"
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
            className="bg-white hover:bg-white/90"
          >
            <LogOut className="h-4 w-4 text-gray-600" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
