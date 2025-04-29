"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Tag,
  ArrowLeft,
} from "lucide-react";

// Utility function to format currency in PHP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Utility function to parse currency input
const parseCurrencyInput = (value: string) => {
  // Remove currency symbol, commas, and other non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, "");
  return parseFloat(numericValue) || 0;
};

interface ItemFormProps {
  initialData?: {
    id?: string;
    external_id?: string;
    client_ext_id?: string;
    brand?: string;
    model?: string;
    code?: string;
    color?: string;
    size?: string;
    inclusion?: string[];
    images?: string[];
    date_purchased?: Date;
    is_active?: boolean;
    category?: string;
    authenticator?: string;
    cost?: number;
    price?: number;
    consignor_selling_price?: number;
    quantity?: number;
    minimum_quantity?: number;
  };
  onSubmit: (data: any) => void;
  clientId?: string;
  clientName?: string;
}

// Example inclusions as suggestions
const suggestedInclusions = [
  "Dust Bag",
  "Box",
  "Receipts",
  "Authentication Cards",
  "Warranty Card",
  "Straps",
  "Care Instructions",
];

export function ItemForm({
  initialData,
  onSubmit,
  clientId,
  clientName,
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    external_id: initialData?.external_id || "",
    client_ext_id: initialData?.client_ext_id || clientId || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    code: initialData?.code || "",
    color: initialData?.color || "",
    size: initialData?.size || "",
    inclusion: initialData?.inclusion || [],
    images: initialData?.images || [],
    date_purchased: initialData?.date_purchased || new Date(),
    is_active:
      initialData?.is_active !== undefined ? initialData.is_active : true,
    category: initialData?.category || "",
    authenticator: initialData?.authenticator || "",
    cost: initialData?.cost || 0,
    price: initialData?.price || 0,
    consignor_selling_price: initialData?.consignor_selling_price || 0,
    quantity: initialData?.quantity || 0,
    minimum_quantity: initialData?.minimum_quantity || 0,
  });

  const [displayPrice, setDisplayPrice] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // State for the inclusion input field
  const [inclusionInput, setInclusionInput] = useState("");

  // Add state for display values
  const [costDisplay, setCostDisplay] = useState(formData.cost ? formatCurrency(formData.cost) : "");
  const [priceDisplay, setPriceDisplay] = useState(formData.price ? formatCurrency(formData.price) : "");
  const [consignorSellingDisplay, setConsignorSellingDisplay] = useState(formData.consignor_selling_price ? formatCurrency(formData.consignor_selling_price) : "");

  // Add a new inclusion
  const addInclusion = () => {
    if (
      inclusionInput.trim() !== "" &&
      !formData.inclusion.includes(inclusionInput.trim())
    ) {
      setFormData({
        ...formData,
        inclusion: [...formData.inclusion, inclusionInput.trim()],
      });
      setInclusionInput("");
    }
  };

  // Handle key press for the inclusion input
  const handleInclusionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInclusion();
    }
  };

  // Remove an inclusion
  const removeInclusion = (inclusion: string) => {
    setFormData({
      ...formData,
      inclusion: formData.inclusion.filter((item) => item !== inclusion),
    });
  };

  // Add a suggested inclusion
  const addSuggestedInclusion = (inclusion: string) => {
    if (!formData.inclusion.includes(inclusion)) {
      setFormData({
        ...formData,
        inclusion: [...formData.inclusion, inclusion],
      });
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process uploaded files
  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    // Create URLs for preview
    const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setUploadedImageUrls((prev) => [...prev, ...newImageUrls]);

    // In a real app, you would handle file uploads to your server here
    // For now we'll just store the file names in formData
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles.map((file) => file.name)],
    }));
  };

  // Remove an uploaded image
  const removeImage = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(uploadedImageUrls[index]);

    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);

    const newImageUrls = [...uploadedImageUrls];
    newImageUrls.splice(index, 1);
    setUploadedImageUrls(newImageUrls);

    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  // Handlers for live formatting
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setFormData({ ...formData, cost: raw });
    setCostDisplay(e.target.value === "" ? "" : raw ? formatCurrency(raw) : "");
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setFormData({ ...formData, price: raw });
    setPriceDisplay(e.target.value === "" ? "" : raw ? formatCurrency(raw) : "");
  };
  const handleConsignorSellingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setFormData({ ...formData, consignor_selling_price: raw });
    setConsignorSellingDisplay(e.target.value === "" ? "" : raw ? formatCurrency(raw) : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you would upload the files to your server here
    // and update formData.images with the URLs returned from the server

    onSubmit({
      ...formData,
      created_by: "System", // This would typically come from authentication context
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="p-6 pb-0">
          <Button variant="ghost" size="sm" asChild className="pl-0 h-8 -ml-2">
            <Link href="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="external_id">Item ID</Label>
              <Input
                id="external_id"
                value={formData.external_id}
                onChange={(e) =>
                  setFormData({ ...formData, external_id: e.target.value })
                }
                required
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={clientName || ""}
                readOnly
                required
              />
              <Input
                type="hidden"
                id="client_ext_id"
                value={formData.client_ext_id}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                value={formData.category || ""}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  {/* Add more categories or a button to manage categories */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, brand: value })}
                value={formData.brand || ""}
              >
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gucci">Gucci</SelectItem>
                  <SelectItem value="lv">Louis Vuitton</SelectItem>
                  {/* Add more brands or a button to manage brands */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="authenticator">Authenticator</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, authenticator: value })}
                value={formData.authenticator || ""}
              >
                <SelectTrigger id="authenticator">
                  <SelectValue placeholder="Select authenticator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bababebi">Bababebi</SelectItem>
                  <SelectItem value="zeko">Zeko</SelectItem>
                  {/* Add more authenticators or a button to manage authenticators */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_purchased">Purchase Date</Label>
              <Input
                id="date_purchased"
                type="date"
                value={format(formData.date_purchased, "yyyy-MM-dd")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date_purchased: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                value={costDisplay}
                onChange={handleCostChange}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consignor_selling_price">Consignor Selling Price</Label>
              <Input
                id="consignor_selling_price"
                value={consignorSellingDisplay}
                onChange={handleConsignorSellingChange}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity !== undefined ? formData.quantity : ""}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                min={0}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum_quantity">Minimum Quantity</Label>
              <Input
                id="minimum_quantity"
                type="number"
                value={formData.minimum_quantity !== undefined ? formData.minimum_quantity : ""}
                onChange={(e) => setFormData({ ...formData, minimum_quantity: Number(e.target.value) })}
                min={0}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inclusions & Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inclusion">Inclusions</Label>
              <div className="flex">
                <Input
                  id="inclusion"
                  value={inclusionInput}
                  onChange={(e) => setInclusionInput(e.target.value)}
                  onKeyDown={handleInclusionKeyDown}
                  placeholder="Type inclusion and press Enter"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addInclusion}
                  className="ml-2"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Press Enter or click + to add each inclusion
              </p>
            </div>

            {/* Suggested inclusions */}
            <div className="space-y-2">
              <Label>Suggested</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedInclusions.map((inclusion) => (
                  <Button
                    key={inclusion}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addSuggestedInclusion(inclusion)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {inclusion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display added inclusions */}
            {formData.inclusion.length > 0 && (
              <div className="space-y-2">
                <Label>Added Inclusions</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.inclusion.map((inclusion, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-primary/10 border border-primary/20 rounded-full px-3 py-1"
                    >
                      <span className="text-sm">{inclusion}</span>
                      <button
                        type="button"
                        onClick={() => removeInclusion(inclusion)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Upload Images</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop images here or click to select files
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>

            {uploadedImageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border bg-background">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Item Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: !!checked })
                }
              />
              <Label htmlFor="is_active">Item is active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}
