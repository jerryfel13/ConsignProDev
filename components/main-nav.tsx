"use client";

import Link from "next/link";
import { Menu, Package, Users, Boxes, Warehouse, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-2 md:gap-10">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:bg-white/20 hover:text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[250px] bg-[#989081] border-r-0 pt-10 text-white"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center text-lg font-medium text-white transition-colors hover:text-white/80"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/clients"
                  className="flex items-center text-lg font-medium text-white transition-colors hover:text-white/80"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Clients
                </Link>
                <Link
                  href="/inventory"
                  className="flex items-center text-lg font-medium text-white transition-colors hover:text-white/80"
                  onClick={() => setIsOpen(false)}
                >
                  <Warehouse className="mr-2 h-5 w-5" />
                  Inventory
                </Link>
                <Link
                  href="/sales"
                  className="flex items-center text-lg font-medium text-white transition-colors hover:text-white/80"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Sales
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/dashboard" className="flex items-center space-x-2 text-white ml-6">
          <Package className="h-6 w-6" />
          <span className="inline-block font-bold">LWPH-SIMS</span>
        </Link>
      </div>
      <nav className="hidden md:flex md:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          Dashboard
        </Link>
        <Link
          href="/clients"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          <Users className="mr-1 h-4 w-4" />
          Clients
        </Link>
        <Link
          href="/inventory"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          <Warehouse className="mr-1 h-4 w-4" />
          Inventory
        </Link>
        <Link
          href="/sales"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          <ShoppingCart className="mr-1 h-4 w-4" />
          Sales
        </Link>
      </nav>
    </div>
  );
}
