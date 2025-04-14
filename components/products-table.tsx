"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AddProductModal } from "@/components/add-product-modal";

// Mock data - replace with actual data fetching
const products = [
  {
    id: 1,
    external_id: "PROD001",
    category_ext_id: "bags",
    brand_ext_id: "gucci",
    name: "Sample Product 1",
    material: "Leather",
    hardware: "Gold",
    code: "GG123",
    measurement: "30x20x10",
    model: "Marmont",
    auth_ext_id: "auth1",
    inclusion: ["dust bag", "box"],
    images: ["url1", "url2"],
    condition_ext_id: "new",
    cost: 1000,
    price: 1500,
    is_consigned: true,
    consignor_ext_id: "client1",
    consignor_selling_price: 1300,
    created_at: "2024-03-20",
    created_by: "John Doe",
  },
  {
    id: 2,
    external_id: "PROD002",
    category_ext_id: "shoes",
    brand_ext_id: "lv",
    name: "Sample Product 2",
    material: "Canvas",
    hardware: "Silver",
    code: "LV456",
    measurement: "EU 38",
    model: "Run Away",
    auth_ext_id: "auth2",
    inclusion: ["dust bag", "box", "receipt"],
    images: ["url3"],
    condition_ext_id: "like_new",
    cost: 800,
    price: 1200,
    is_consigned: false,
    created_at: "2024-03-20",
    created_by: "Jane Smith",
  },
];

export function ProductsTable() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
  };

  const toggleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProducts.length === products.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>External ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => toggleSelectProduct(product.id)}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.external_id}</TableCell>
              <TableCell>{product.category_ext_id}</TableCell>
              <TableCell>{product.brand_ext_id}</TableCell>
              <TableCell>{product.model}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.condition_ext_id}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.is_consigned ? "default" : "secondary"}>
                  {product.is_consigned ? "Consigned" : "In Stock"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{product.created_at}</span>
                  <span className="text-xs text-muted-foreground">{product.created_by}</span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Product</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 