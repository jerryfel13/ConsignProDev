"use client";

import { useState, useEffect, useRef } from "react";
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
  stock_external_id: string;
  product_ext_id: string;
  name: string;
  price: string;
  stock: {
    qty_in_stock: number;
  };
  brand: {
    name: string;
  };
  code: string;
  images: string[];
  category?: {
    name: string;
  };
}

interface Client {
  external_id: string;
  first_name: string;
  last_name: string;
  is_consignor: boolean;
}

interface SelectedProduct {
  stock_external_id: string;
  qty: number;
  images: string[] | null;
  name: string;
  price: string;
}

// Utility functions for currency input
function parseCurrencyInput(value: string) {
  return value.replace(/[^0-9.]/g, "");
}

function formatCurrency(value: string | number) {
  if (value === "" || isNaN(Number(value))) return "";
  return Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export default function CreateReceiptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [isLayaway, setIsLayaway] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentAmountDisplay, setPaymentAmountDisplay] = useState("");
  const [datePurchased, setDatePurchased] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [layawayMonths, setLayawayMonths] = useState("1");
  const [layawayDueDate, setLayawayDueDate] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<{ [key: string]: number }>({});
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const clientSectionRef = useRef<HTMLDivElement>(null);
  const [showClientIndicator, setShowClientIndicator] = useState(false);
  const productSectionRef = useRef<HTMLDivElement>(null);
  const [showProductIndicator, setShowProductIndicator] = useState(false);

  // Calculate due date based on base date and number of months
  const calculateDueDate = (baseDate: string, months: number) => {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // Update due date when paymentDate or layawayMonths changes
  useEffect(() => {
    if (isLayaway) {
      setLayawayDueDate(calculateDueDate(paymentDate, parseInt(layawayMonths)));
    }
  }, [paymentDate, layawayMonths, isLayaway]);

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
        const productsResponse =  await axios.get("https://lwphsims-uat.up.railway.app/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
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
            last_name: c.last_name,
            is_consignor: c.is_consignor || false
          })));
        }

        if (productsResponse.data.status?.success) {
          setProducts(productsResponse.data.data);
          console.log(productsResponse.data.data);
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

  // Update filtered clients when search or clients change
  useEffect(() => {
    let filtered = clients;
    // Filter by search text
    if (clientSearch.trim() !== "") {
      const searchLower = clientSearch.toLowerCase();
      filtered = filtered.filter(client => 
        client.first_name.toLowerCase().includes(searchLower) ||
        client.last_name.toLowerCase().includes(searchLower) ||
        client.external_id.toLowerCase().includes(searchLower)
      );
    }
    setFilteredClients(filtered);
  }, [clientSearch, clients]);

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

  // Update payment amount when total changes or layaway status changes
  useEffect(() => {
    if (isLayaway) {
      setPaymentAmount("");
    } else {
      const total = calculateTotal();
      const formatted = total ? formatCurrency(total) : "";
      setPaymentAmount(formatted);
    }
  }, [isLayaway, selectedProducts, isDiscounted, discountType, discountValue]);

  const handleSubmit = async () => {
    // User-friendly validation
    if (!selectedClient) {
      toast.error("Please select a client.");
      setShowClientIndicator(true);
      clientSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }
    if (!isLayaway) {
      const numericPaymentAmount = Number(paymentAmount.replace(/,/g, ""));
      if (!paymentAmount || isNaN(numericPaymentAmount) || numericPaymentAmount <= 0) {
        toast.error("Payment amount must be greater than 0.");
        return;
      }
    }
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
          product_ext_id: product.stock_external_id,
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
      if (error.response) {
        console.error("API error response:", error.response.data);
        toast.error(error.response.data?.message || error.response.data?.status?.message || JSON.stringify(error.response.data) || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
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
            <div ref={clientSectionRef} className={showClientIndicator ? "border border-red-500 rounded-lg p-2" : ""}>
              <label className="block mb-1">Client</label>
              <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => setIsClientDialogOpen(true)}
                  >
                    {selectedClient ? 
                      clients.find(c => c.external_id === selectedClient)?.first_name + " " + 
                      clients.find(c => c.external_id === selectedClient)?.last_name 
                      : "Select a client"}
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col h-[80vh] max-h-[80vh] max-w-2xl w-full">
                  <DialogHeader>
                    <DialogTitle>Select Client</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search clients..."
                        className="mb-2"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                      />
                      {clientSearch && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setClientSearch("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full pr-4">
                      <div className="grid grid-cols-1 gap-2">
                        {filteredClients.map((client) => (
                          <div
                            key={client.external_id}
                            className={`border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer ${
                              selectedClient === client.external_id ? 'border-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              setSelectedClient(client.external_id);
                              setShowClientIndicator(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
              <div>
                                <h3 className="font-medium">{client.first_name} {client.last_name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>ID: {client.external_id}</span>
                                  {client.is_consignor && (
                                    <Badge variant="secondary" className="ml-2">Consignor</Badge>
                                  )}
                                </div>
                              </div>
                              {selectedClient === client.external_id && (
                                <Badge variant="default">Selected</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="pt-4 pb-2 flex flex-col sm:flex-row justify-end gap-2 border-t z-10 mt-4 bg-white">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setSelectedClient("");
                        setIsClientDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-full sm:w-auto font-semibold"
                      onClick={() => {
                        if (!selectedClient) {
                          toast.error("Please select a client first");
                          return;
                        }
                        setIsClientDialogOpen(false);
                      }}
                    >
                      Confirm Selection
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {showClientIndicator && (
              <div className="text-red-600 text-sm mt-1">
                Please select a client to proceed.
              </div>
            )}

            {/* Products Selection */}
            <div ref={productSectionRef} className={showProductIndicator ? "border border-red-500 rounded-lg p-2" : ""}>
              <div className="flex justify-between items-center mb-2">
                <label className="block">Products</label>
                <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600"
                      onClick={() => setShowProductIndicator(false)}
                    >
                      <Plus className="inline-block mr-1" size={18}/>Add product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col h-[80vh] max-h-[80vh] max-w-3xl w-full">
                    <DialogHeader>
                      <DialogTitle>Select Products</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4">
                <Input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-h-0">
                      <ScrollArea className="h-full pr-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {products
                            .filter(product => product.stock.qty_in_stock > 0)
                            .filter(product => {
                              const search = productSearch.toLowerCase();
                              return (
                                product.name.toLowerCase().includes(search) ||
                                product.brand.name.toLowerCase().includes(search) ||
                                product.code.toLowerCase().includes(search)
                              );
                            })
                            .map((product) => (
                              <div
                                key={product.stock_external_id}
                                className={`bg-white border rounded-xl shadow-sm transition-all flex flex-col h-full p-4 relative
                                  ${selectedQuantity[product.stock_external_id] > 0 ? 'border-blue-400 ring-2 ring-blue-100' : 'hover:border-blue-300'}`}
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                                    ) : (
                                      <span className="text-3xl text-gray-300">👜</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                                        {product.brand.name}
                                      </span>
                                      {product.category && (
                                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                                          {product.category.name}
                                        </span>
                                      )}
                                    </div>
                                    <h3 className="font-semibold text-base text-gray-900 truncate">{product.name}</h3>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`font-semibold text-blue-700 ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 }).length > 10 ? 'text-sm' : 'text-base'}`}>
                                    ₱{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </span>
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border transition-colors
                                      ${product.stock.qty_in_stock > 0
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : 'bg-gray-200 text-gray-500 border-gray-300'}
                                    `}
                                  >
                                    In Stock: {product.stock.qty_in_stock}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-2">
                                  <div className="flex items-center gap-2 w-full justify-center">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="min-w-8 h-8 sm:min-w-8 sm:h-8 text-base"
                                      onClick={() => {
                                        setSelectedQuantity(prev => ({
                                          ...prev,
                                          [product.stock_external_id]: Math.max(0, (prev[product.stock_external_id] || 0) - 1)
                                        }));
                                      }}
                                      disabled={!selectedQuantity[product.stock_external_id]}
                                    >
                                      -
                                    </Button>
                                    <span className="min-w-8 text-center font-semibold text-base sm:text-lg">
                                      {selectedQuantity[product.stock_external_id] || 0}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="min-w-8 h-8 sm:min-w-8 sm:h-8 text-base"
                                      onClick={() => {
                                        // Calculate total quantity including already selected products
                                        const currentSelectedQty = selectedProducts.find(p => p.stock_external_id === product.stock_external_id)?.qty || 0;
                                        const newQty = (selectedQuantity[product.stock_external_id] || 0) + 1;
                                        
                                        // Only allow if total quantity doesn't exceed stock
                                        if (currentSelectedQty + newQty <= product.stock.qty_in_stock) {
                                          setSelectedQuantity(prev => ({
                                            ...prev,
                                            [product.stock_external_id]: newQty
                                          }));
                                        } else {
                                          toast.error(`Cannot add more than available stock (${product.stock.qty_in_stock})`);
                                        }
                                      }}
                                      disabled={!product.stock.qty_in_stock ||
                                        (selectedQuantity[product.stock_external_id] || 0) >= product.stock.qty_in_stock}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="pt-4 pb-2 flex flex-col sm:flex-row justify-end gap-2 border-t z-10 mt-4 bg-white">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setIsProductModalOpen(false);
                          setSelectedQuantity({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="w-full sm:w-auto font-semibold"
                        onClick={() => {
                          // Add selected products to the list
                          const newProducts = Object.entries(selectedQuantity)
                            .filter(([_, qty]) => qty > 0)
                            .map(([stockExternalId, qty]) => {
                              const product = products.find(p => p.stock_external_id === stockExternalId);
                              return {
                                stock_external_id: stockExternalId,
                                qty,
                                images: product?.images || null,
                                name: `${product?.brand.name} ${product?.name}`,
                                price: product?.price || "0"
                              };
                            });

                          // Check if adding these products would exceed stock limits
                          const wouldExceedStock = newProducts.some(newProd => {
                            const existingProduct = selectedProducts.find(p => p.stock_external_id === newProd.stock_external_id);
                            const totalQty = (existingProduct?.qty || 0) + newProd.qty;
                            const product = products.find(p => p.stock_external_id === newProd.stock_external_id);
                            return totalQty > (product?.stock.qty_in_stock || 0);
                          });

                          if (wouldExceedStock) {
                            toast.error("Cannot add more than available stock for some products");
                            return;
                          }

                          setSelectedProducts(prev => {
                            const updated = [...prev];
                            newProducts.forEach(newProd => {
                              const existingIdx = updated.findIndex(p => p.stock_external_id === newProd.stock_external_id);
                              if (existingIdx !== -1) {
                                updated[existingIdx] = {
                                  ...updated[existingIdx],
                                  qty: updated[existingIdx].qty + newProd.qty
                                };
                              } else {
                                updated.push(newProd);
                              }
                            });
                            return updated;
                          });
                          setIsProductModalOpen(false);
                          setSelectedQuantity({});
                          setShowProductIndicator(false);
                        }}
                      >
                        Add Selected Products
                      </Button>
                    </div>
                    {showProductIndicator && (
                      <div className="text-red-600 text-sm mt-1">
                        Please add at least one product to enable layaway.
                      </div>
                    )}
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
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isLayaway}
                  onChange={() => setIsLayaway(false)}
                  className="accent-blue-600"
                />
                <span className="font-medium">Regular Sale</span>
                <span className="text-xs text-gray-500 ml-2">Full payment at purchase</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isLayaway}
                  onChange={() => {
                    if (selectedProducts.length === 0) {
                      toast.error("Please add at least one product before enabling layaway.");
                      setShowProductIndicator(true);
                      productSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                      return;
                    }
                    setIsLayaway(true);
                    setShowProductIndicator(false);
                  }}
                  className="accent-blue-600"
                />
                <span className="font-medium">Layaway Sale</span>
                <span className="text-xs text-gray-500 ml-2">Pay in installments</span>
              </label>
            </div>

            {/* Layaway Fields */}
            {isLayaway && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Number of Months</label>
                  <Select
                    value={layawayMonths}
                    onValueChange={(value) => setLayawayMonths(value)}
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
                  type="text"
                  value={paymentAmount}
                  onChange={e => {
                    if (!isLayaway) return;
                    const raw = parseCurrencyInput(e.target.value);
                    setPaymentAmount(raw);
                  }}
                  onBlur={() => {
                    if (!isLayaway) return;
                    setPaymentAmount(paymentAmount ? formatCurrency(paymentAmount) : "");
                  }}
                  onFocus={() => {
                    if (!isLayaway) return;
                    setPaymentAmount(paymentAmount.replace(/,/g, ""));
                  }}
                  readOnly={!isLayaway}
                  inputMode="decimal"
                  placeholder="0.00"
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
