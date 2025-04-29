"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateReceiptPage() {
  const [date, setDate] = useState<Date | undefined>(new Date("2025-04-24"));

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Link href="/sales" className="text-lg font-medium">← Create Receipt</Link>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon"><Eye /></Button>
          <Button>Save</Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Main Form */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Receipt #0001001</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <div className="font-medium mb-2">Billed To</div>
              <Button variant="link" className="p-0 h-auto text-blue-600"><Plus className="inline-block mr-1" size={18}/>Add client</Button>
            </div>
          </div>
          <div className="mb-6">
            <div className="font-medium mb-2">Item</div>
            <Button variant="link" className="p-0 h-auto text-blue-600"><Plus className="inline-block mr-1" size={18}/>Add item</Button>
          </div>
          <div className="mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal (PHP)</span>
                <span className="font-semibold">₱0.00</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold mb-6">
            <span>Total (PHP)</span>
            <span>₱0.00</span>
          </div>
          <div>
            <div className="font-medium mb-2">Notes</div>
            <Button variant="link" className="p-0 h-auto text-blue-600"><Plus className="inline-block mr-1" size={18}/>Add note</Button>
          </div>
        </div>
        {/* Sidebar */}
        <div className="flex flex-col gap-6 w-full lg:w-[340px]">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-2">
            <div className="font-semibold mb-4">Receipt Terms</div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Date issued</label>
              <Input type="text" value="April 24, 2025" readOnly className="cursor-pointer" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="font-semibold mb-4">Payment Method</div>
            <label className="block text-sm mb-1">Mode of payment</label>
            <Select defaultValue="cash">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
} 