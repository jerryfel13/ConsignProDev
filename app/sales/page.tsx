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
import { useState } from "react";

// Data model for a sales record
interface SaleRecord {
  id: number;
  external_id: string;
  client_ext_id: string;
  total_amount: number;
  date_purchased: string;
  payment_method: string;
  created_at: string;
  created_by: string;
  deleted_at?: string;
  deleted_by?: string;
}

export default function SalesPage() {
  // Example state for a new sale record
  const [sale, setSale] = useState<SaleRecord>({
    id: 0,
    external_id: "",
    client_ext_id: "",
    total_amount: 0,
    date_purchased: "",
    payment_method: "Cash",
    created_at: new Date().toISOString(),
    created_by: "",
    deleted_at: undefined,
    deleted_by: undefined,
  });

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSale((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold">Sales Transactions</h1>
          <Link href="/sales/record-sales">
            <Button>
              Record Sale
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
              <h2 className="text-xl font-semibold mb-2">Record sales</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Record a sale if you got paid already
              </p>
              <div className="flex gap-4">
                <Link href="/sales/create-receipt">
                  <Button variant="outline">Record Sale</Button>
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

        <form className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">External ID</label>
              <input
                name="external_id"
                value={sale.external_id}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Client External ID</label>
              <input
                name="client_ext_id"
                value={sale.client_ext_id}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Total Amount</label>
              <input
                name="total_amount"
                type="number"
                value={sale.total_amount}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Date Purchased</label>
              <input
                name="date_purchased"
                type="datetime-local"
                value={sale.date_purchased}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Payment Method</label>
              <select
                name="payment_method"
                value={sale.payment_method}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Created By</label>
              <input
                name="created_by"
                value={sale.created_by}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                maxLength={100}
                required
              />
            </div>
            {/* Optionally show deleted fields for admin/debug */}
            {/*
            <div>
              <label className="block mb-1">Deleted At</label>
              <input
                name="deleted_at"
                type="datetime-local"
                value={sale.deleted_at || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Deleted By</label>
              <input
                name="deleted_by"
                value={sale.deleted_by || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                maxLength={100}
              />
            </div>
            */}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save Sale</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 