"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Phone,
  Home,
  Instagram,
  Facebook,
  Plus,
  Calendar,
  Tag,
  User,
  CreditCard,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

// Function to get client data based on ID
const getClientData = (id: string) => {
  // For the example, we'll return different mock data based on ID
  if (id === "1") {
    return {
      id: 1,
      external_id: "CL001",
      first_name: "Jane",
      middle_name: "",
      last_name: "Doe",
      suffix: "",
      email: "jane.doe@example.com",
      contact_no: "+1 123-456-7890",
      address: "123 Main Street, Anytown, USA",
      instagram: "janedoe_insta",
      facebook: "janedoe.fb",
      is_Consignor: true,
      is_active: true,
      created_at: "2023-05-15",
      bank_details: {
        account_name: "Jane Doe",
        account_no: "123456789",
        bank: "First National Bank",
      },
    };
  } else {
    return {
      id: 2,
      external_id: "CL002",
      first_name: "John",
      middle_name: "",
      last_name: "Smith",
      suffix: "",
      email: "john.smith@example.com",
      contact_no: "+1 123-987-6543",
      address: "456 Oak Lane, Somewhere, USA",
      instagram: "johnsmith_insta",
      facebook: "johnsmith.fb",
      is_Consignor: false,
      is_active: true,
      created_at: "2023-06-20",
      bank_details: null,
    };
  }
};

// Mock data for items
const items = [
  {
    id: 1,
    brand: "Gucci",
    model: "Dionysus Bag",
    code: "ITGC001",
    status: "Active",
    type: "Bag",
  },
  {
    id: 2,
    brand: "Louis Vuitton",
    model: "Neverfull MM",
    code: "ITLV002",
    status: "Sold",
    type: "Bag",
  },
];

// Mock data for transactions
const transactions = [
  {
    id: 1,
    date: "2023-06-01",
    type: "Sale",
    item: "Gucci Dionysus Bag",
    amount: "$1,200.00",
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-07-15",
    type: "Payout",
    item: "-",
    amount: "$960.00",
    status: "Completed",
  },
];

// Mock consignments data
const clientConsignments = [
  {
    id: "con-1",
    code: "LV-NF-001",
    brand: "Louis Vuitton",
    model: "Neverfull MM",
    description: "Damier Ebene MM Tote Bag",
    dateReceived: "2023-04-15",
    status: "Listed",
    sellingPrice: "₱145,000.00",
    commission: "20%",
  },
  {
    id: "con-2",
    code: "CC-CF-002",
    brand: "Chanel",
    model: "Classic Flap",
    description: "Medium Black Caviar with Gold Hardware",
    dateReceived: "2023-03-10",
    status: "Sold",
    sellingPrice: "₱250,000.00",
    commission: "25%",
  },
];

type Item = {
  id: number;
  brand: string;
  model: string;
  code: string;
  status: string;
  type: string;
};

type Transaction = {
  id: number;
  date: string;
  type: string;
  item: string;
  amount: string;
  status: string;
};

// The correct approach for React Server Components in Next.js 14+
export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("details");

  // Safe approach that works in the current version while preparing for future changes
  // The explicit type assertion ensures we maintain type safety
  const unwrappedParams = React.use(
    params as unknown as Promise<{ id: string }>
  );
  const clientId =
    typeof unwrappedParams === "object" && unwrappedParams?.id
      ? unwrappedParams.id
      : params.id;

  // Get client data based on ID
  const clientData = getClientData(clientId);

  // Columns for items table
  const itemColumns: ColumnDef<Item>[] = [
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Active" ? "default" : "outline"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
  ];

  // Columns for transactions table
  const transactionColumns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "item",
      header: "Item",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Completed" ? "default" : "outline"}>
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="container p-0 md:py-4 md:px-4 max-w-6xl mx-auto">
      {/* Header Card */}
      <Card className="mb-6 border-0 md:border md:shadow-sm">
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex items-start md:items-center justify-between">
            <div className="flex items-center md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="mr-0 -ml-2 p-2 h-8 md:hidden"
              >
                <Link href="/clients">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="mr-2 hidden md:flex"
              >
                <Link href="/clients">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Clients
                </Link>
              </Button>
              <div className="flex flex-col items-center md:items-start">
                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                  <h1 className="text-2xl font-bold text-center md:text-left">
                    {clientData.first_name} {clientData.last_name}
                  </h1>
                  <div className="flex justify-center gap-2 mt-2 mb-1 md:mt-0 md:mb-0">
                    {clientData.is_active && <Badge>Active</Badge>}
                    {clientData.is_Consignor && (
                      <Badge variant="secondary">Consignor</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  Client ID: {clientData.external_id}
                </p>
              </div>
            </div>
            <div className="hidden md:flex md:gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/clients/${clientId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="px-4 py-3 flex justify-center md:hidden">
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/clients/${clientId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" className="flex-1">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="w-full grid grid-cols-3 md:w-auto md:mx-auto">
            <TabsTrigger value="details">Details</TabsTrigger>
            {clientData.is_Consignor && (
              <TabsTrigger value="items">Items</TabsTrigger>
            )}
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="mt-0 space-y-6">
          {/* Contact Information Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Contact Information</CardTitle>
              </div>
              <CardDescription>Personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    First Name
                  </h3>
                  <p className="font-medium">{clientData.first_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </h3>
                  <p className="font-medium">{clientData.last_name}</p>
                </div>
                {clientData.middle_name && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Middle Name
                    </h3>
                    <p className="font-medium">{clientData.middle_name}</p>
                  </div>
                )}
                {clientData.suffix && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Suffix
                    </h3>
                    <p className="font-medium">{clientData.suffix}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center p-2 rounded hover:bg-muted transition-colors">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <a
                    href={`mailto:${clientData.email}`}
                    className="text-primary"
                  >
                    {clientData.email}
                  </a>
                </div>

                <div className="flex items-center p-2 rounded hover:bg-muted transition-colors">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <a href={`tel:${clientData.contact_no}`}>
                    {clientData.contact_no}
                  </a>
                </div>

                <div className="flex items-start p-2 rounded hover:bg-muted transition-colors">
                  <Home className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <span>{clientData.address}</span>
                </div>

                {clientData.instagram && (
                  <div className="flex items-center p-2 rounded hover:bg-muted transition-colors">
                    <Instagram className="h-5 w-5 mr-3 text-primary" />
                    <a
                      href={`https://instagram.com/${clientData.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{clientData.instagram}
                    </a>
                  </div>
                )}

                {clientData.facebook && (
                  <div className="flex items-center p-2 rounded hover:bg-muted transition-colors">
                    <Facebook className="h-5 w-5 mr-3 text-primary" />
                    <a
                      href={`https://facebook.com/${clientData.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {clientData.facebook}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bank Details Card if Consignor */}
          {clientData.is_Consignor && clientData.bank_details && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Bank Details</CardTitle>
                </div>
                <CardDescription>
                  Banking information for Consignor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Bank
                  </h3>
                  <p className="font-medium">{clientData.bank_details.bank}</p>
                </div>
                <div className="p-3 rounded bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Account Name
                  </h3>
                  <p className="font-medium">
                    {clientData.bank_details.account_name}
                  </p>
                </div>
                <div className="p-3 rounded bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </h3>
                  <p className="font-medium">
                    {clientData.bank_details.account_no}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Additional Information</CardTitle>
              </div>
              <CardDescription>System and metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created At
                  </h3>
                  <p className="font-medium">{clientData.created_at}</p>
                </div>
                <div className="p-3 rounded bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Client Status
                  </h3>
                  <p className="font-medium">
                    {clientData.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="p-3 rounded bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Consignor Status
                  </h3>
                  <p className="font-medium">
                    {clientData.is_Consignor ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items Tab (only for Consignors) */}
        {clientData.is_Consignor && (
          <TabsContent value="items" className="mt-0">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Consignment Items</CardTitle>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/consignments/new?clientId=${clientId}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Consignment
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Items consigned by this client for selling
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {clientConsignments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                            Code
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                            Item
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                            Date
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientConsignments.map((consignment) => (
                          <tr
                            key={consignment.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium">
                              {consignment.code}
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">
                                  {consignment.brand} {consignment.model}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {consignment.description}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {consignment.dateReceived}
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              {consignment.sellingPrice}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Badge
                                variant="outline"
                                className={`${
                                  consignment.status === "Sold"
                                    ? "bg-black text-white hover:bg-black"
                                    : consignment.status === "Listed"
                                    ? "bg-blue-500 text-white hover:bg-blue-500"
                                    : ""
                                }`}
                              >
                                {consignment.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8"
                              >
                                <Link href={`/consignments/${consignment.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No consignment items found for this client
                    </p>
                    <Button asChild>
                      <Link href={`/consignments/new?clientId=${clientId}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Consignment
                      </Link>
                    </Button>
                  </div>
                )}
                <div className="p-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/clients/${clientId}/consignments`}>
                      View All Consignments
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="transactions" className="mt-0">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Transactions</CardTitle>
              </div>
              <CardDescription>
                Financial transactions history for this client
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {transactions.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Item
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">{transaction.date}</td>
                          <td className="py-4 px-4">{transaction.type}</td>
                          <td className="py-4 px-4">{transaction.item}</td>
                          <td className="py-4 px-4 text-right font-medium">
                            {transaction.amount}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge
                              variant="outline"
                              className={`${
                                transaction.status === "Completed"
                                  ? "bg-black text-white hover:bg-black"
                                  : ""
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No transactions found for this client
                    </p>
                    <Button asChild>
                      <Link href={`/transactions/new?clientId=${clientId}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                      </Link>
                    </Button>
                  </div>
                )}
                <div className="p-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/clients/${clientId}/transactions`}>
                      View All Transactions
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
