"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import {
  ArrowLeft,
  Box,
  Package,
  Wrench,
  ScanLine,
  Upload,
  Info,
  ChevronDown,
  Save,
  Plus,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ProductCategoryModal } from "@/components/product-category-modal";
import { ProductBrandModal } from "@/components/product-brand-modal";
import { ProductAuthenticatorModal } from "@/components/product-authenticator-modal";

const formSchema = z.object({
  category_ext_id: z.string().min(1, "Category is required"),
  brand_ext_id: z.string().min(1, "Brand is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  material: z.string().optional(),
  hardware: z.string().optional(),
  code: z.string().optional(),
  measurement: z.string().optional(),
  model: z.string().optional(),
  auth_ext_id: z.string().min(1, "Authenticator is required"),
  inclusion: z.array(z.string()),
  images: z.array(z.string()),
  condition: z.object({
    interior: z.enum(["Good", "Good as new", "New", "Old"], {
      required_error: "Please select interior condition",
    }),
    exterior: z.enum(["Good", "Good as new", "New", "Old"], {
      required_error: "Please select exterior condition",
    }),
    overall: z.enum(["Good", "Good as new", "New", "Old"], {
      required_error: "Please select overall condition",
    }),
    description: z.string().optional(),
  }),
  stock: z.object({
    min_qty: z.coerce.number().min(0, "Minimum quantity must be a positive number"),
    qty_in_stock: z.coerce.number().min(0, "Quantity in stock must be a positive number"),
  }),
  cost: z.number().min(0, "Cost must be a positive number"),
  price: z.number().min(0, "Price must be a positive number"),
  is_consigned: z.boolean(),
  consignor_ext_id: z.string().optional(),
  consignor_selling_price: z.number().optional(),
  consigned_date: z.string().optional(),
  created_by: z.string().min(1, "Created by is required"),
});

type FormData = z.infer<typeof formSchema>;

// Mock authenticator data - replace with API call
const authenticators = [
  { external_id: "auth1", name: "Bababebi" },
  { external_id: "auth2", name: "Zeko" },
];

const suggestedInclusions = [
  "Dust Bag",
  "Box",
  "Receipts",
  "Authentication Cards",
  "Warranty Card",
  "Straps",
  "Care Instructions",
];

// Add currency formatting utilities
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
const parseCurrencyInput = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  return parseFloat(numericValue) || 0;
};

export default function AddNewItemPage() {
  const [itemType, setItemType] = useState("product");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isAuthenticatorModalOpen, setIsAuthenticatorModalOpen] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [costDisplay, setCostDisplay] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [brands, setBrands] = useState<Array<{ external_id: string; name: string }>>([]);
  const [categories, setCategories] = useState<Array<{ external_id: string; name: string }>>([]);
  const [authenticators, setAuthenticators] = useState<Array<{ external_id: string; name: string }>>([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://lwphsims-uat.up.railway.app/products/categories");
        if (response.data.status.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("https://lwphsims-uat.up.railway.app/products/brands");
        if (response.data.status.success) {
          setBrands(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Fetch authenticators on component mount
  useEffect(() => {
    const fetchAuthenticators = async () => {
      try {
        const response = await axios.get("https://lwphsims-uat.up.railway.app/products/authenticators");
        if (response.data.status.success) {
          setAuthenticators(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching authenticators:", error);
      }
    };

    fetchAuthenticators();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_ext_id: "",
      brand_ext_id: "",
      name: "",
      material: "",
      hardware: "",
      code: "",
      measurement: "",
      model: "",
      auth_ext_id: "",
      inclusion: [],
      images: [],
      condition: {
        interior: "Good",
        exterior: "Good",
        overall: "Good",
        description: "",
      },
      stock: {
        min_qty: 1,
        qty_in_stock: 0,
      },
      cost: 0,
      price: 0,
      is_consigned: false,
      consignor_ext_id: "",
      consignor_selling_price: 0,
      consigned_date: "",
      created_by: "admin_user",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Ensure stock values are numbers
      const stockData = {
        min_qty: Number(data.stock.min_qty),
        qty_in_stock: Number(data.stock.qty_in_stock)
      };

      // Prepare the request payload
      const payload = {
        ...data,
        stock: stockData,
        condition: {
          interior: data.condition.interior,
          exterior: data.condition.exterior,
          overall: data.condition.overall,
          description: data.condition.description || ""
        },
        consigned_date: data.is_consigned ? new Date().toISOString().split('T')[0] : undefined,
        created_by: "admin_user" // This should be replaced with actual logged-in user's ID
      };

      const response = await axios.post(
        "https://lwphsims-uat.up.railway.app/products",
        payload
      );

      if (response.data.status.success) {
        setSuccess("Product successfully created!");
        // Reset form and displays
        form.reset();
        setCostDisplay("");
        setPriceDisplay("");
        setInclusions([]);
      } else {
        setError(response.data.status.message || "Failed to create product");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setError(Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(", ") 
            : error.response.data.message);
        } else {
          setError("An error occurred while creating the product");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryAdded = async (category: { external_id: string; name: string }) => {
    try {
      const response = await axios.post(
        "https://lwphsims-uat.up.railway.app/products/categories",
        {
          name: category.name,
          created_by: "admin_user" // This should be replaced with actual logged-in user's ID
        }
      );

      if (response.data.status.success) {
        // Add the new category to the list
        setCategories(prevCategories => [...prevCategories, response.data.data]);
        // Set the selected category
        form.setValue("category_ext_id", response.data.data.external_id);
      } else {
        setError(response.data.status.message || "Failed to create category");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setError(Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(", ") 
            : error.response.data.message);
        } else {
          setError("An error occurred while creating the category");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleBrandAdded = (brand: { external_id: string; name: string }) => {
    setBrands(prevBrands => [...prevBrands, brand]);
    form.setValue("brand_ext_id", brand.external_id);
  };

  const handleAuthenticatorAdded = async (authenticator: { external_id: string; name: string }) => {
    try {
      const response = await axios.post(
        "https://lwphsims-uat.up.railway.app/products/authenticators",
        {
          name: authenticator.name,
          created_by: "admin_user" // This should be replaced with actual logged-in user's ID
        }
      );

      if (response.data.status.success) {
        // Add the new authenticator to the list
        setAuthenticators(prevAuthenticators => [...prevAuthenticators, response.data.data]);
        // Set the selected authenticator
        form.setValue("auth_ext_id", response.data.data.external_id);
      } else {
        setError(response.data.status.message || "Failed to create authenticator");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setError(Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(", ") 
            : error.response.data.message);
        } else {
          setError("An error occurred while creating the authenticator");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleAddInclusion = (value: string) => {
    if (value && !inclusions.includes(value)) {
      const newInclusions = [...inclusions, value];
      setInclusions(newInclusions);
      form.setValue("inclusion", newInclusions);
    }
    setNewInclusion("");
  };

  const handleRemoveInclusion = (value: string) => {
    const newInclusions = inclusions.filter(i => i !== value);
    setInclusions(newInclusions);
    form.setValue("inclusion", newInclusions);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInclusion(newInclusion);
    }
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    const formatted = raw ? formatCurrency(raw) : "";
    setCostDisplay(formatted);
    form.setValue("cost", raw);
  };

  return (
    <>
      <div className="flex flex-col p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/inventory" passHref>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Inventory</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Add New Item</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Barcode
            </Button>
            <Button variant="outline" disabled>
              <Upload className="mr-2 h-4 w-4" />
              Import Item
            </Button>
          </div>
        </div>

        <Card>
            <CardContent className="space-y-6">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold">Product details</h3>
                <p className="text-sm text-muted-foreground">
                  Add your product to make cost management easier (* for required fields)
                </p>
              </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category_ext_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category*</FormLabel>
                          <div className="flex gap-2">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.external_id} value={category.external_id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setIsCategoryModalOpen(true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand_ext_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand*</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.external_id} value={brand.external_id}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setIsBrandModalOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hardware"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hardware</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="measurement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Measurement</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="auth_ext_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authenticator*</FormLabel>
                          <div className="flex gap-2">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select authenticator" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {authenticators.map((auth) => (
                                <SelectItem key={auth.external_id} value={auth.external_id}>
                                  {auth.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setIsAuthenticatorModalOpen(true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                    name="condition.interior"
                      render={({ field }) => (
                        <FormItem>
                        <FormLabel>Interior Condition*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                              <SelectValue placeholder="Select interior condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="New" className="text-green-600">
                              <div className="flex items-center gap-2">
                                <span>New</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item is in perfect condition, never used</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Good as new" className="text-emerald-600">
                              <div className="flex items-center gap-2">
                                <span>Good as new</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item shows minimal signs of use, almost like new</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Good" className="text-blue-600">
                              <div className="flex items-center gap-2">
                                <span>Good</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item is in good condition with normal wear and tear</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Old" className="text-amber-600">
                              <div className="flex items-center gap-2">
                                <span>Old</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item shows significant wear and signs of age</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="condition.exterior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exterior Condition*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select exterior condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New" className="text-green-600">
                              <div className="flex items-center gap-2">
                                <span>New</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item is in perfect condition, never used</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Good as new" className="text-emerald-600">
                              <div className="flex items-center gap-2">
                                <span>Good as new</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item shows minimal signs of use, almost like new</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Good" className="text-blue-600">
                              <div className="flex items-center gap-2">
                                <span>Good</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item is in good condition with normal wear and tear</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Old" className="text-amber-600">
                              <div className="flex items-center gap-2">
                                <span>Old</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item shows significant wear and signs of age</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition.overall"
                      render={({ field }) => (
                        <FormItem>
                        <FormLabel>Overall Condition*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                              <SelectValue placeholder="Select overall condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="New" className="text-green-600">
                              <div className="flex items-center gap-2">
                                <span>New</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item is in perfect condition, never used</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Good as new" className="text-emerald-600">
                              <div className="flex items-center gap-2">
                                <span>Good as new</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item shows minimal signs of use, almost like new</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Good" className="text-blue-600">
                              <div className="flex items-center gap-2">
                                <span>Good</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item is in good condition with normal wear and tear</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            <SelectItem value="Old" className="text-amber-600">
                              <div className="flex items-center gap-2">
                                <span>Old</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Item shows significant wear and signs of age</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="condition.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost*</FormLabel>
                          <FormControl>
                            <Input
                              value={costDisplay}
                              onChange={handleCostChange}
                              placeholder="0.00"
                              inputMode="decimal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price*</FormLabel>
                          <FormControl>
                            <Input
                              value={priceDisplay}
                              onChange={e => {
                                const raw = parseCurrencyInput(e.target.value);
                                field.onChange(raw);
                                setPriceDisplay(e.target.value === "" ? "" : raw ? formatCurrency(raw) : "");
                              }}
                              placeholder="0.00"
                              inputMode="decimal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_consigned"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Consigned</FormLabel>
                            <FormDescription>
                              Is this a consigned item?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("is_consigned") && (
                      <>
                        <FormField
                          control={form.control}
                          name="consignor_ext_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consignor</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select consignor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="client1">Client 1</SelectItem>
                                  <SelectItem value="client2">Client 2</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consignor_selling_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consignor Selling Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                  <FormField
                    control={form.control}
                    name="stock.min_qty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Quantity*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            step="1"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          The minimum quantity that should be maintained in stock
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock.qty_in_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity in Stock*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            step="1"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Current quantity available in stock
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Inclusions</h2>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Inclusions</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type inclusion and press Enter"
                          value={newInclusion}
                          onChange={(e) => setNewInclusion(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddInclusion(newInclusion)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Press Enter or click + to add each inclusion
                      </p>

                      {inclusions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {inclusions.map((inclusion) => (
                            <Badge
                              key={inclusion}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {inclusion}
                              <button
                                type="button"
                                onClick={() => handleRemoveInclusion(inclusion)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium mb-2">Suggested</h4>
                        <div className="flex flex-wrap gap-2">
                          {suggestedInclusions.map((suggestion) => (
                            <Badge
                              key={suggestion}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary"
                              onClick={() => handleAddInclusion(suggestion)}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Product"}
                    </Button>
                  <Button type="submit" variant="outline" disabled={isSubmitting}>
                      Save & Add New Product
                    </Button>
                    <Link href="/inventory" passHref>
                      <Button variant="ghost">Cancel</Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
        </Card>
      </div>

      <ProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />

      <ProductBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onBrandAdded={handleBrandAdded}
      />

      <ProductAuthenticatorModal
        isOpen={isAuthenticatorModalOpen}
        onClose={() => setIsAuthenticatorModalOpen(false)}
        onAuthenticatorAdded={handleAuthenticatorAdded}
      />
    </>
  );
} 