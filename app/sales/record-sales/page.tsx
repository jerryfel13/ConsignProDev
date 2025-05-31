"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Product {
  product_external_id: string;
  name: string;
  price: string;
  stock: {
    qty_in_stock: number;
  };
  brand: {
    name: string;
  };
  code: string;
}

interface Client {
  external_id: string;
  first_name: string;
  last_name: string;
}

interface SelectedProduct {
  product_ext_id: string;
  qty: number;
  images: string[] | null;
  name: string;
  price: string;
}

export default function CreateReceiptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [isLayaway, setIsLayaway] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("0");
  const [datePurchased, setDatePurchased] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [layawayMonths, setLayawayMonths] = useState("1");
  const [layawayDueDate, setLayawayDueDate] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<{ [key: string]: number }>({});

  // Calculate due date based on number of months
  const calculateDueDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // Update due date when number of months changes
  const handleMonthsChange = (value: string) => {
    const months = parseInt(value);
    const dueDate = calculateDueDate(months);
    setLayawayMonths(value);
    setLayawayDueDate(dueDate);
  };

  // Fetch clients and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not authenticated. Please log in again.");
          return;
        }

        // Fetch clients
        const clientsResponse = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch products
        const productsResponse = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            isConsigned: 'Y',
            pageNumber: 1,
            displayPerPage: 100,
            sortBy: 'name',
            orderBy: 'asc'
          }
        });

        if (clientsResponse.data.status?.success) {
          setClients(clientsResponse.data.data.map((c: any) => ({
            external_id: c.external_id,
            first_name: c.first_name,
            last_name: c.last_name
          })));
        }

        if (productsResponse.data.status?.success) {
          setProducts(productsResponse.data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data?.message || "Failed to fetch data");
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response from server. Please check your connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("An error occurred while setting up the request.");
        }
      }
    };

    fetchData();
  }, []);

  // Calculate total amount
  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce((sum, product) => {
      return sum + (parseFloat(product.price) * product.qty);
    }, 0);

    if (!isDiscounted) return subtotal;

    if (discountType === "percentage") {
      const discount = subtotal * (parseFloat(discountValue) / 100);
      return subtotal - discount;
    } else {
      return subtotal - parseFloat(discountValue);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in again.");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const totalAmount = calculateTotal();

      // Only include layaway if type is 'L', and set payment.amount for regular
      const saleData: any = {
        client_ext_id: selectedClient,
        type: isLayaway ? "L" : "R",
        products: selectedProducts.map(product => ({
          product_ext_id: product.product_ext_id,
          qty: product.qty,
          images: product.images
        })),
        is_discounted: isDiscounted,
        discount_percentage: discountType === "percentage" ? discountValue : "0",
        discount_flat_rate: discountType === "flat" ? discountValue : "0",
        date_purchased: datePurchased,
        payment: {
          amount: isLayaway ? paymentAmount : totalAmount.toString(),
          payment_date: paymentDate,
          payment_method: paymentMethod
        },
        created_by: userData.external_id || "",
      };
      if (isLayaway) {
        saleData.layaway = {
          no_of_months: parseInt(layawayMonths),
          due_date: layawayDueDate
        };
      }

      const response = await axios.post(
        'https://lwphsims-uat.up.railway.app/sales',
        saleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status?.success) {
        toast.success("Sale recorded successfully");
        router.push("/sales");
      } else {
        toast.error(response.data.status?.message || "Failed to record sale");
      }
    } catch (error: any) {
      console.error("Failed to submit sale:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Link href="/sales" className="text-lg font-medium">← Back to Sales</Link>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon"><Eye /></Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Main Form */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">New Sale</h2>
          
          <div className="space-y-6">
            {/* Client Selection */}
            <div>
              <label className="block mb-1">Client</label>
              <Select
                value={selectedClient}
                onValueChange={setSelectedClient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.external_id} value={client.external_id}>
                      {client.first_name} {client.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block">Products</label>
                <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600"
                    >
                      <Plus className="inline-block mr-1" size={18}/>Add product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Select Products</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <div 
                            key={product.product_external_id}
                            className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{product.brand.name} {product.name}</h3>
                                <p className="text-sm text-gray-500">Code: {product.code}</p>
                              </div>
                              <Badge 
                                variant={product.stock.qty_in_stock > 0 ? "default" : "destructive"}
                              >
                                {product.stock.qty_in_stock > 0 ? `In Stock: ${product.stock.qty_in_stock}` : "Out of Stock"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="text-lg font-semibold">
                                ₱{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedQuantity(prev => ({
                                      ...prev,
                                      [product.product_external_id]: Math.max(0, (prev[product.product_external_id] || 0) - 1)
                                    }));
                                  }}
                                  disabled={!selectedQuantity[product.product_external_id]}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">
                                  {selectedQuantity[product.product_external_id] || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedQuantity(prev => ({
                                      ...prev,
                                      [product.product_external_id]: (prev[product.product_external_id] || 0) + 1
                                    }));
                                  }}
                                  disabled={!product.stock.qty_in_stock || 
                                    (selectedQuantity[product.product_external_id] || 0) >= product.stock.qty_in_stock}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsProductModalOpen(false);
                          setSelectedQuantity({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Add selected products to the list
                          const newProducts = Object.entries(selectedQuantity)
                            .filter(([_, qty]) => qty > 0)
                            .map(([productId, qty]) => {
                              const product = products.find(p => p.product_external_id === productId);
                              return {
                                product_ext_id: productId,
                                qty,
                                images: null,
                                name: `${product?.brand.name} ${product?.name}`,
                                price: product?.price || "0"
                              };
                            });

                          setSelectedProducts(prev => [...prev, ...newProducts]);
                          setIsProductModalOpen(false);
                          setSelectedQuantity({});
                        }}
                      >
                        Add Selected Products
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Selected Products List */}
              {selectedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg mb-3 bg-gray-50 hover:shadow transition-shadow"
                >
                  {/* Product Image or Placeholder */}
                  <div className="flex-shrink-0 w-12 h-12 bg-white border rounded-md flex items-center justify-center overflow-hidden">
                    {/* If you have product.images, use the first image, else show a placeholder icon */}
                    {/* <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="object-cover w-full h-full" /> */}
                    <span className="text-gray-300 text-2xl">👜</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {/* If you have brand and code, show them here */}
                      {/* {product.brand} | {product.code} */}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      <span className="font-medium text-blue-700">₱{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <span className="mx-1">×</span>
                      <span className="font-medium">{product.qty}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-2 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                    onClick={() => {
                      setSelectedProducts(prev => prev.filter((_, i) => i !== index));
                    }}
                    aria-label="Remove product"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Sale Type */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={isLayaway}
                onCheckedChange={setIsLayaway}
              />
              <Label>Layaway Sale</Label>
            </div>

            {/* Layaway Fields */}
            {isLayaway && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Number of Months</label>
                  <Select
                    value={layawayMonths}
                    onValueChange={handleMonthsChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="4">4 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <div>
                  <label className="block mb-1">Due Date</label>
                <Input
                    type="date"
                    value={layawayDueDate}
                    onChange={(e) => setLayawayDueDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Discount Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isDiscounted}
                  onCheckedChange={setIsDiscounted}
                />
                <Label>Apply Discount</Label>
              </div>

              {isDiscounted && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Discount Type</label>
                    <Select
                      value={discountType}
                      onValueChange={(value: "percentage" | "flat") => {
                        setDiscountType(value);
                        setDiscountValue("0");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="flat">Flat Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block mb-1">
                      {discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
                    </label>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      min="0"
                      max={discountType === "percentage" ? "100" : undefined}
                      step={discountType === "percentage" ? "1" : "0.01"}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Payment Method</label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Payment Amount</label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1">Payment Date</label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>

            {/* Dates Section */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Date Purchased</label>
                <Input
                  type="date"
                  value={datePurchased}
                  onChange={(e) => setDatePurchased(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 w-full lg:w-[340px]">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{selectedProducts.reduce((sum, product) => sum + (parseFloat(product.price) * product.qty), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {isDiscounted && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>
                      {discountType === "percentage" 
                        ? `${discountValue}%`
                        : `₱${parseFloat(discountValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₱{calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
                {isLayaway && (
                  <div className="flex justify-between text-blue-600">
                    <span>Outstanding Balance:</span>
                    <span>₱{(calculateTotal() - parseFloat(paymentAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
                )}
          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
