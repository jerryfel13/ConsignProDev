"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock consignment data for this client
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

export default function ClientConsignmentsPage({
  params,
}: {
  params: { id: string };
}) {
  const clientId = params.id;

  // Mock client data
  const client = {
    id: clientId,
    name: "Jane Doe",
    externalId: "CL001",
    isActive: true,
    isConsignor: true,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="p-4 md:p-6 border-b bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Consignments</h1>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients`}>Back to Client</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto p-4 md:p-6">
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Client Consignments
              </CardTitle>
              <Button size="sm" asChild>
                <Link href={`/consignments/new?clientId=${clientId}`}>
                  Add Consignment
                </Link>
              </Button>
            </div>
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
                      Code
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Item
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Price
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
                  {clientConsignments.map((consignment) => (
                    <tr
                      key={consignment.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {consignment.dateReceived}
                        </div>
                      </td>
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
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/consignments/${consignment.id}`}>
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

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₱395,000.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
