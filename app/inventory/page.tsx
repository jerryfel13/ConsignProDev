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

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  // Placeholder counts - replace with actual data fetching later
  const outOfStockCount = "N/A";
  const lowStockCount = "N/A";
  const expiredCount = "N/A";
  const allItemsCount = 0;

  return (
    <>
   

      <div className="flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">
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
                <DropdownMenuItem disabled>
                  <Upload className="mr-2 h-4 w-4" /> Import item
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <ScanLine className="mr-2 h-4 w-4" /> Scan barcode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of stock</CardTitle>
              <Box className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low in stock</CardTitle>
              <TrendingDown className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <TabsList>
                  <TabsTrigger value="all">
                    All <Badge variant="secondary" className="ml-2">{allItemsCount}</Badge>
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search or scan to find items..."
                      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1.5 top-1 h-7 w-7">
                      <ScanLine className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Scan Barcode</span>
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Filter
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Status</DropdownMenuItem>
                      <DropdownMenuItem>Category</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        Sort by: Most Recent
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Most Recent</DropdownMenuItem>
                      <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                      <DropdownMenuItem>Stock (Low to High)</DropdownMenuItem>
                      <DropdownMenuItem>Stock (High to Low)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all" className="mt-4">
                {allItemsCount === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Package2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your products & services show up here</h3>
                    <p className="text-muted-foreground mb-4">
                      Click the Add Item button below to add product & services
                    </p>
                    <Button asChild>
                      <Link href="/inventory/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p>Inventory items table will go here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-4">
          You can also <Link href="#" className="underline">import</Link> your items or check our <Link href="#" className="underline">items tutorial</Link>.
        </div>
      </div>
    </>
  );
} 