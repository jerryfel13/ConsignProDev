"use client";

import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  condition_ext_id: z.string().min(1, "Condition is required"),
  cost: z.number().min(0, "Cost must be a positive number"),
  price: z.number().min(0, "Price must be a positive number"),
  is_consigned: z.boolean(),
  consignor_ext_id: z.string().optional(),
  consignor_selling_price: z.number().optional(),
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
  const [newInclusion, setNewInclusion] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([]);
  // Add display state for cost and price
  const [costDisplay, setCostDisplay] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");

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
      condition_ext_id: "",
      cost: 0,
      price: 0,
      is_consigned: false,
      consignor_ext_id: "",
      consignor_selling_price: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: Implement API call to create product
      console.log("Creating product:", data);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCategoryAdded = (category: { external_id: string; name: string }) => {
    // TODO: Update categories list
    form.setValue("category_ext_id", category.external_id);
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

  const handleCostChange = (e) => {
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
          

          {itemType === "product" && (
            <CardContent className="space-y-6">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold">Product details</h3>
                <p className="text-sm text-muted-foreground">
                  Add your product to make cost management easier (* for required fields)
                </p>
              </div>

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
                                <SelectItem value="bags">Bags</SelectItem>
                                <SelectItem value="shoes">Shoes</SelectItem>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gucci">Gucci</SelectItem>
                              <SelectItem value="lv">Louis Vuitton</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condition_ext_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="like_new">Like New</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                            </SelectContent>
                          </Select>
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
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Product
                    </Button>
                    <Button type="submit" variant="outline">
                      Save & Add New Product
                    </Button>
                    <Link href="/inventory" passHref>
                      <Button variant="ghost">Cancel</Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}

          {itemType === "service" && (
            <CardContent className="space-y-6">
              <Separator />
              <div className="text-center py-10">
                <p className="text-muted-foreground">Service fields will go here.</p>
              </div>
              <Separator />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="default">Save Service</Button>
                <Button variant="outline">Save & Add New Service</Button>
                <Link href="/inventory" passHref>
                  <Button variant="ghost">Cancel</Button>
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <ProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </>
  );
} 