"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, CreditCard, Receipt, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

// Mock transaction data
const clientTransactions = [
  {
    id: "trx-1",
    date: "2023-06-01",
    formattedDate: "2023-06-01",
    type: "Sale",
    item: "Gucci Dionysus Bag",
    description: "",
    amount: "₱1,200.00",
    status: "Completed",
  },
  {
    id: "trx-2",
    date: "2023-07-15",
    formattedDate: "2023-07-15",
    type: "Payout",
    item: "-",
    description: "",
    amount: "₱960.00",
    status: "Completed",
  },
];

export default function ClientTransactionsPage({
  params,
}: {
  params: { id: string };
}) {
  // This is how to handle params according to Next.js documentation
  const { id: clientId } = params;

  // Mock client data
  const client = {
    id: clientId,
    name: "Jane Doe",
    externalId: "CL001",
    isActive: true,
    isConsignor: true,
  };

  // Calculate totals for summary
  const totalPurchases = "₱1,500.00";
  const totalConsignments = "₱2,500.00";
  const totalPayments = "₱1,000.00";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="p-4 md:p-6 border-b bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients/${clientId}`}>Back to Client</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto p-4 md:p-6">
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {transaction.formattedDate}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                          {transaction.type}
                        </div>
                      </td>
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
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link
                            href={`/clients/${clientId}/transactions/${transaction.id}`}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="text-2xl font-bold text-red-500">-₱1,500.00</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Consignments
                </p>
                <p className="text-2xl font-bold text-red-500">-₱2,500.00</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold text-green-600">+₱1,000.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
