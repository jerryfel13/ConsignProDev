"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Utility function to format currency in PHP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
};

interface Transaction {
  id: string;
  type: "Purchase" | "Consignment" | "Payment";
  amount: number;
  date: Date;
  status: "Completed" | "Pending" | "Cancelled";
  description?: string;
  items?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export default function TransactionsPage() {
  const params = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchTransactions = async () => {
      try {
        // Simulated API call
        const mockTransactions: Transaction[] = [
          {
            id: "1",
            type: "Purchase",
            amount: 1500,
            date: new Date(),
            status: "Completed",
            description: "Purchase of antique vase",
            items: [
              {
                id: "1",
                name: "Antique Vase",
                price: 1500,
                quantity: 1,
              },
            ],
          },
          {
            id: "2",
            type: "Consignment",
            amount: 2500,
            date: new Date(),
            status: "Pending",
            description: "Consignment of painting",
            items: [
              {
                id: "2",
                name: "Oil Painting",
                price: 2500,
                quantity: 1,
              },
            ],
          },
          {
            id: "3",
            type: "Payment",
            amount: -1000,
            date: new Date(),
            status: "Completed",
            description: "Payment received",
          },
        ];

        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <Button variant="outline" asChild>
          <Link href={`/clients/${params.id}`}>Back to Client</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(transaction.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={
                      transaction.amount < 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {transaction.amount < 0 ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Completed"
                          ? "default"
                          : transaction.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
