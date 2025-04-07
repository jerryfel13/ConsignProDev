"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Transaction {
  id: string;
  type: "Purchase" | "Consignment" | "Payment";
  amount: number;
  date: Date;
  status: "Completed" | "Pending" | "Cancelled";
  description?: string;
}

// Utility function to format currency in PHP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function ClientViewPage() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchClientData = async () => {
      try {
        // Simulated API call
        const mockClient: Client = {
          id: params.id as string,
          name: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "(555) 123-4567",
          status: "Active",
          address: "123 Main St, City, State",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockTransactions: Transaction[] = [
          {
            id: "1",
            type: "Purchase",
            amount: 1500,
            date: new Date(),
            status: "Completed",
            description: "Purchase of antique vase",
          },
          {
            id: "2",
            type: "Consignment",
            amount: 2500,
            date: new Date(),
            status: "Pending",
            description: "Consignment of painting",
          },
        ];

        setClient(mockClient);
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clients">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{client.name}</h1>
        </div>
        <div className="space-x-2">
          <Button asChild>
            <Link href={`/clients/${client.id}/edit`}>Edit Profile</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              // TODO: Implement deactivate functionality
              console.log("Deactivate client:", client.id);
            }}
          >
            Deactivate Client
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="consignments">Consignments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{client.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      client.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm">
                        {format(transaction.date, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </p>
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consignments">
          <Card>
            <CardHeader>
              <CardTitle>Consignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                No consignments found
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
