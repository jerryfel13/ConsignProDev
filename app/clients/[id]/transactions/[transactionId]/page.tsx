"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Receipt,
  FileText,
  Clock,
  Printer,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock transaction data
const transactionDetails = {
  id: 1,
  date: "Apr 10, 2025",
  type: "Purchase",
  description: "Purchase of antique vase",
  amount: "-₱1,500.00",
  status: "Completed",
  reference: "TRX-001-2025",
  payment_method: "Cash",
  notes: "Client purchased the item directly from store",
  items: [
    {
      id: 1,
      name: "Antique Ceramic Vase",
      description: "19th century blue and white ceramic vase",
      quantity: 1,
      price: "₱1,500.00",
    },
  ],
};

export default function TransactionDetailPage({
  params,
}: {
  params: { id: string; transactionId: string };
}) {
  const clientId = params.id;
  const transactionId = params.transactionId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      {/* Main Content */}
      <div className="container p-4 md:p-6">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                  <Link
                    href={`/clients/${clientId}/transactions`}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Link>
                </Button>
                <h2 className="text-xl font-bold">Transaction Details</h2>
              </div>
              <Badge
                variant={
                  transactionDetails.status === "Completed"
                    ? "default"
                    : "outline"
                }
                className={
                  transactionDetails.status === "Completed"
                    ? "bg-black text-white hover:bg-black"
                    : ""
                }
              >
                <Clock className="mr-1 h-3 w-3" />
                {transactionDetails.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="bg-gray-50 pb-3 border-b">
                    <CardTitle className="flex items-center">
                      <Receipt className="h-5 w-5 mr-2" />
                      Transaction Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Type
                        </h3>
                        <p className="font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                          {transactionDetails.type}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Date
                        </h3>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {transactionDetails.date}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Reference Number
                        </h3>
                        <p className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          {transactionDetails.reference}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Payment Method
                        </h3>
                        <p className="font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                          {transactionDetails.payment_method}
                        </p>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Description
                        </h3>
                        <p className="font-medium">
                          {transactionDetails.description}
                        </p>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Notes
                        </h3>
                        <p className="font-medium">
                          {transactionDetails.notes}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="bg-gray-50 pb-3 border-b">
                    <CardTitle className="flex items-center">
                      <Receipt className="h-5 w-5 mr-2" />
                      Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                              Item
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                              Description
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                              Quantity
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionDetails.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4 font-medium">
                                {item.name}
                              </td>
                              <td className="py-4 px-4">{item.description}</td>
                              <td className="py-4 px-4 text-center">
                                {item.quantity}
                              </td>
                              <td className="py-4 px-4 text-right">
                                {item.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">
                      {transactionDetails.amount.replace("-", "")}
                    </span>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="shadow-sm h-fit sticky top-20">
                  <CardHeader className="bg-gray-50 pb-3 border-b">
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Total Amount
                    </p>
                    <p
                      className={`text-3xl font-bold mb-4 ${
                        transactionDetails.amount.startsWith("+")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transactionDetails.amount}
                    </p>
                    <div className="w-full flex flex-col gap-3 mt-2">
                      <Button
                        className="w-full flex items-center justify-center"
                        variant="outline"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print Receipt
                      </Button>
                      <Button className="w-full flex items-center justify-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
