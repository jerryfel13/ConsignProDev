"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, CreditCard, Receipt, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { use, useEffect, useState } from "react";
import axios from "axios";

export default function ClientTransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = use(params);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const displayPerPage = 10;

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    axios
      .get(`https://lwphsims-uat.up.railway.app/sales/client/${clientId}/transactions`, {
        params: {
          pageNumber: currentPage,
          displayPerPage,
          sortBy: 'created_at',
          orderBy: 'desc',
        }
      })
      .then((res) => {
        if (res.data.status?.success) {
          setTransactions(res.data.data || []);
          setError("");
        } else {
          setError("No transactions found.");
        }
      })
      .catch(() => setError("Failed to fetch transactions."))
      .finally(() => setLoading(false));
  }, [clientId, currentPage]);

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
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={6} className="text-center text-red-600 py-8">{error}</td></tr>
                  ) : transactions.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8">No transactions found.</td></tr>
                  ) : transactions.map((transaction) => (
                    <tr
                      key={transaction.sale_external_id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {transaction.date_purchased ? new Date(transaction.date_purchased).toLocaleDateString() : "-"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                          {transaction.type?.description || transaction.type || "-"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {transaction.product && transaction.product.length > 0
                          ? transaction.product[0].name
                          : "-"}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ₱{Number(transaction.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`$${
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
                            href={`/clients/${clientId}/transactions/${transaction.sale_external_id}`}
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
            {/* Pagination Controls */}
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="text-sm font-medium">Page {currentPage}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={transactions.length < displayPerPage}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
