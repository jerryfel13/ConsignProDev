"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Receipt, Search, SlidersHorizontal, ChevronDown, FilePlus2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Using next/image for potential optimization

export default function SalesPage() {
  return (
    <div>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold">Sales Transactions</h1>
          <Link href="/sales/create-receipt">
            <Button>
              Create Receipt
              <Receipt className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4 overflow-x-auto justify-start">
            {/* Only show 'All' and 'Consigned' tabs for filtering */}
            <TabsTrigger value="all">All (0)</TabsTrigger>
            <TabsTrigger value="consigned">Consigned (0)</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for transactions..."
                className="pl-8 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="most-recent">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-recent">Sort by: Most Recent</SelectItem>
                  <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                  {/* Add other sort options */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content area - Currently showing empty state */}
          <TabsContent value="all">
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed rounded-lg bg-slate-50">
               {/* Placeholder for the illustration - replace with actual image/SVG */}
               <div className="mb-4 p-4 rounded-full bg-blue-100">
                  <FilePlus2 className="h-10 w-10 text-blue-600" /> 
                  {/* Simple icon placeholder, replace with actual sleepy document icon */}
              </div>
              <h2 className="text-xl font-semibold mb-2">Create sales receipts</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Send a sales receipt if you got paid already
              </p>
              <div className="flex gap-4">
                <Link href="/sales/create-receipt">
                  <Button variant="outline">Create Receipt</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="consigned">
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed rounded-lg bg-slate-50">
              <div className="mb-4 p-4 rounded-full bg-blue-100">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Sold Consigned Items</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                This tab will show all sold consigned items.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 