"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const LOW_STOCK_THRESHOLD = 5;

type Product = {
  stock_external_id: string;
  product_external_id: string;
  category: {
    code: string;
    name: string;
  };
  brand: {
    code: string;
    name: string;
  };
  name: string;
  material: string;
  hardware: string;
  code: string;
  measurement: string;
  model: string;
  authenticator: {
    code: string;
    name: string;
  };
  inclusions: string[];
  images: string[];
  condition: {
    interior: string;
    exterior: string;
    overall: string;
    description: string;
  };
  cost: string;
  price: string;
  stock: {
    min_qty: number;
    qty_in_stock: number;
    sold_stock: number;
  };
  is_consigned: boolean;
  consignor?: {
    code: string;
    first_name: string;
    last_name: string;
  };
  consignor_selling_price?: string;
  consigned_date?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
};

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    consigned: false,
    layaway: false,
    outOfStock: false,
    lowStock: false,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalNumber: 0,
    totalPages: 1,
    displayPage: 10,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let params: any = {
          searchValue: search,
          isConsigned: filters.consigned ? "Y" : "N",
          pageNumber: pagination.page,
          displayPerPage: pagination.displayPage,
          sortBy: "name",
          orderBy: "asc",
        };
        if (filters.lowStock) {
          params.isLowStock = "y";
        }
        if (filters.outOfStock) {
          params.isOutOfStock = "y";
        }
        const response = await axios.get("https://lwphsims-uat.up.railway.app/products", { params });
        if (response.data.status.success) {
          setProducts(response.data.data);
          setPagination(response.data.meta);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        setError("An error occurred while fetching products");
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [search, filters, pagination.page]);

  // Filtering logic
  const filteredProducts = products;

  // Out of stock count
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  useEffect(() => {
    const fetchOutOfStockCount = async () => {
      if (filters.outOfStock) {
        setOutOfStockCount(products.length);
      } else {
        try {
          const response = await axios.get("https://lwphsims-uat.up.railway.app/products", { params: { isOutOfStock: "y" } });
          if (response.data.status.success) {
            setOutOfStockCount(response.data.data.length);
          }
        } catch {
          setOutOfStockCount(0);
        }
      }
    };
    fetchOutOfStockCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.outOfStock, products]);

  // For low stock count, fetch from API if not filtering, otherwise use products.length
  const [lowStockCount, setLowStockCount] = useState(0);
  useEffect(() => {
    const fetchLowStockCount = async () => {
      if (filters.lowStock) {
        setLowStockCount(products.length);
      } else {
        try {
          const response = await axios.get("https://lwphsims-uat.up.railway.app/products", { params: { isLowStock: "y" } });
          if (response.data.status.success) {
            setLowStockCount(response.data.data.length);
          }
        } catch {
          setLowStockCount(0);
        }
      }
    };
    fetchLowStockCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.lowStock, products]);
  const allItemsCount = products.length;

  const handleDeleteClick = (stock_external_id: string) => {
    setDeleteId(stock_external_id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setShowDeleteModal(false);
    setDeletingId(deleteId);
    try {
      const response = await axios.delete(
        `https://lwphsims-uat.up.railway.app/products/id/${deleteId}`,
        { data: { deleted_by: "admin_user" } }
      );
      if (response.data.status.success) {
        toast(
          <div className="px-5 py-4 flex flex-col items-center bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h4 className="text-center font-medium text-lg text-gray-900 mb-1">
              Product Deleted
            </h4>
            <p className="text-center text-gray-600 mb-2">
              The product was successfully deleted.
            </p>
          </div>,
          {
            position: "top-center",
            duration: 2000,
            className: "!bg-transparent !shadow-none !p-0 !rounded-none",
          }
        );
        setProducts((prev) => prev.filter((p) => p.stock_external_id !== deleteId));
      } else {
        toast.error(response.data.status.message || "Failed to delete product.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product.");
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  };

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
                    <th className="p-3 text-left align-middle w-[120px] font-semibold text-gray-700 border-b">Category</th>
                    <th className="p-3 text-left align-middle w-[120px] font-semibold text-gray-700 border-b">Brand</th>
                    <th className="p-3 text-left align-middle w-[80px] font-semibold text-gray-700 border-b">Stock</th>
                    <th className="p-3 text-left align-middle w-[110px] font-semibold text-gray-700 border-b">Price</th>
                    <th className="p-3 text-left align-middle w-[110px] font-semibold text-gray-700 border-b">Consigned</th>
                    <th className="p-3 text-left align-middle w-[160px] font-semibold text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-red-400">{error}</td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">No items found.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, idx) => (
                      <tr
                        key={product.product_external_id}
                        className={
                          idx % 2 === 0
                            ? "bg-white hover:bg-gray-50 border-b"
                            : "bg-gray-50 hover:bg-gray-100 border-b"
                        }
                      >
                        <td className="p-3 text-left align-middle w-[220px] truncate max-w-[200px]">{product.name}</td>
                        <td className="p-3 text-left align-middle w-[120px] truncate max-w-[100px]">{product.category.name}</td>
                        <td className="p-3 text-left align-middle w-[120px] truncate max-w-[100px]">{product.brand.name}</td>
                        <td className="p-3 text-left align-middle w-[80px]">{product.stock.qty_in_stock}</td>
                        <td className="p-3 text-left align-middle w-[110px]">₱{Number(product.price).toLocaleString()}</td>
                        <td className="p-3 text-left align-middle w-[110px]">{product.is_consigned ? "Yes" : "No"}</td>
                        <td className="p-3 text-left align-middle w-[160px] flex items-center gap-2 justify-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/inventory/${product.stock_external_id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/inventory/${product.stock_external_id}/edit`)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteClick(product.stock_external_id)}
                                disabled={deletingId === product.stock_external_id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deletingId === product.stock_external_id ? "Deleting..." : "Delete"}
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h4 className="text-center font-medium text-lg text-gray-900 mb-1">
              Confirm Delete
            </h4>
            <p className="text-center text-gray-600 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 