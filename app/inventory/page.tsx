"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  TrendingDown,
  AlertTriangle,
  Search,
  Filter,
  Package2,
  PlusCircle,
  ScanLine,
  LineChart,
  ChevronDown,
  Plus,
  Upload,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ItemsTable } from "@/components/items-table";
import { useRouter } from "next/navigation";

const LOW_STOCK_THRESHOLD = 5;

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  consigned: boolean;
  layaway: boolean;
};

const initialItems: InventoryItem[] = [
    {
      id: "1",
    name: "Louis Vuitton Neverfull MM",
    sku: "LV-NF-001",
    stock: 0,
    consigned: true,
    layaway: true,
    },
    {
      id: "2",
    name: "Rolex Datejust 41",
    sku: "RLX-DJ-002",
    stock: 3,
    consigned: true,
    layaway: false,
  },
  {
    id: "3",
    name: "Gucci Marmont Bag",
    sku: "GCC-MMT-003",
    stock: 10,
    consigned: false,
    layaway: true,
  },
];

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [filters, setFilters] = useState({
    consigned: false,
    layaway: false,
    outOfStock: false,
    lowStock: false,
  });
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [showRestock, setShowRestock] = useState<InventoryItem | null>(null);

  // Filtering logic
  const filteredItems = items.filter((item) => {
    if (filters.consigned && !item.consigned) return false;
    if (filters.layaway && !item.layaway) return false;
    if (filters.outOfStock && item.stock > 0) return false;
    if (filters.lowStock && (item.stock >= LOW_STOCK_THRESHOLD || item.stock === 0)) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const outOfStockCount = items.filter((i) => i.stock === 0).length;
  const lowStockCount = items.filter((i) => i.stock > 0 && i.stock < LOW_STOCK_THRESHOLD).length;
  const allItemsCount = items.length;

  // Add Product logic
  function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement & {
      name: { value: string };
      sku: { value: string };
      stock: { value: string };
      consigned: { checked: boolean };
      layaway: { checked: boolean };
    };
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: form.name.value,
      sku: form.sku.value,
      stock: Number(form.stock.value),
      consigned: form.consigned.checked,
      layaway: form.layaway.checked,
    };
    setItems((prev) => [...prev, newItem]);
    setShowAdd(false);
  }

  // Restock logic
  function handleRestock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement & {
      amount: { value: string };
    };
    const amount = Number(form.amount.value);
    setItems((prev) =>
      prev.map((item) =>
        showRestock && item.id === showRestock.id
          ? { ...item, stock: Math.max(0, item.stock + amount) }
          : item
      )
    );
    setShowRestock(null);
  }

  return (
    <>
      <div className="flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/inventory/stock-analysis')}>
              <LineChart className="mr-2 h-4 w-4" />
              Run Stock Analysis
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  Add New Item
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                   <Link href="/inventory/new" className="flex items-center">
                     <Plus className="mr-2 h-4 w-4" /> Add item manually
                   </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card
            onClick={() => setFilters(f => ({ ...f, outOfStock: !f.outOfStock, lowStock: false }))}
            className={`cursor-pointer transition-shadow ${filters.outOfStock ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of stock</CardTitle>
              <Box className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockCount}</div>
            </CardContent>
          </Card>
          <Card
            onClick={() => setFilters(f => ({ ...f, lowStock: !f.lowStock, outOfStock: false }))}
            className={`cursor-pointer transition-shadow ${filters.lowStock ? 'ring-2 ring-yellow-500 shadow-lg' : ''}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low in stock</CardTitle>
              <TrendingDown className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full border text-sm bg-white rounded shadow">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left align-middle w-[220px] font-semibold text-gray-700 border-b">Name</th>
                    <th className="p-3 text-left align-middle w-[120px] font-semibold text-gray-700 border-b">SKU</th>
                    <th className="p-3 text-left align-middle w-[80px] font-semibold text-gray-700 border-b">Stock</th>
                    <th className="p-3 text-left align-middle w-[110px] font-semibold text-gray-700 border-b">Consigned</th>
                    <th className="p-3 text-left align-middle w-[110px] font-semibold text-gray-700 border-b">Layaway</th>
                    <th className="p-3 text-left align-middle w-[160px] font-semibold text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">No items found.</td>
                    </tr>
                  ) : (
                    filteredItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={
                          idx % 2 === 0
                            ? "bg-white hover:bg-gray-50 border-b"
                            : "bg-gray-50 hover:bg-gray-100 border-b"
                        }
                      >
                        <td className="p-3 text-left align-middle w-[220px] truncate max-w-[200px]">{item.name}</td>
                        <td className="p-3 text-left align-middle w-[120px] truncate max-w-[100px]">{item.sku}</td>
                        <td className="p-3 text-left align-middle w-[80px]">{item.stock}</td>
                        <td className="p-3 text-left align-middle w-[110px]">{item.consigned ? "Yes" : "No"}</td>
                        <td className="p-3 text-left align-middle w-[110px]">{item.layaway ? "Yes" : "No"}</td>
                        <td className="p-3 text-left align-middle w-[160px] flex items-center gap-2 justify-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/inventory/${item.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); setEditItem(item); }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this item?')) setItems(prev => prev.filter(i => i.id !== item.id)); }} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleAddProduct} className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            <div className="mb-2">
              <label className="block mb-1">Name</label>
              <input name="name" className="border p-2 w-full" required />
            </div>
            <div className="mb-2">
              <label className="block mb-1">SKU</label>
              <input name="sku" className="border p-2 w-full" required />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Stock</label>
              <input name="stock" type="number" min="0" className="border p-2 w-full" required />
            </div>
            <div className="mb-2 flex gap-4">
              <label><input type="checkbox" name="consigned" /> Consigned</label>
              <label><input type="checkbox" name="layaway" /> Layaway</label>
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">Add</Button>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          {/* You can reuse the Add Product form here, pre-filled with editItem's data, and update on submit */}
          {/* ... implement edit form ... */}
        </div>
      )}

      {/* Restock Modal */}
      {showRestock && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleRestock} className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <h2 className="text-lg font-bold mb-4">Restock: {showRestock.name}</h2>
            <div className="mb-2">
              <label className="block mb-1">Amount (+/-)</label>
              <input name="amount" type="number" defaultValue={1} className="border p-2 w-full" required />
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">Apply</Button>
              <Button type="button" variant="outline" onClick={() => setShowRestock(null)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 