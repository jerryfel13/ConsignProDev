"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemsTable } from "@/components/items-table";
import { ItemForm } from "@/components/item-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientItemsTabsProps {
  clientId: string;
  clientName: string;
}

export function ClientItemsTabs({
  clientId,
  clientName,
}: ClientItemsTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="returned">Returned</TabsTrigger>
            </TabsList>
            <Button asChild>
              <Link href={`/clients/${clientId}/items/new`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Link>
            </Button>
          </div>

          <TabsContent value="all" className="mt-4">
            <ItemsTable initialFilter={{ clientName }} />
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <ItemsTable initialFilter={{ status: "Active", clientName }} />
          </TabsContent>

          <TabsContent value="archived" className="mt-4">
            <ItemsTable initialFilter={{ status: "Archived", clientName }} />
          </TabsContent>

          <TabsContent value="returned" className="mt-4">
            <ItemsTable initialFilter={{ status: "Returned", clientName }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
