"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ConsignmentFormProps {
  initialData?: {
    id: string;
    brand: string;
    model: string;
    code: string;
    color: string;
    size: string;
    inclusions: string[];
    condition: "Like New" | "Excellent" | "Good" | "Worn";
    sellingPrice: number;
    clientName: string;
    status: "New" | "Processing" | "Listed" | "Sold";
    commission: number;
  };
  onSubmit: (data: any) => void;
}

const defaultInclusions = [
  "Box",
  "Dust Bag",
  "Authentication Card",
  "Receipt",
  "Warranty Card",
  "Care Card",
];

export function ConsignmentForm({
  initialData,
  onSubmit,
}: ConsignmentFormProps) {
  const [formData, setFormData] = useState({
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    code: initialData?.code || "",
    color: initialData?.color || "",
    size: initialData?.size || "",
    inclusions: initialData?.inclusions || [],
    condition: initialData?.condition || "Like New",
    sellingPrice: initialData?.sellingPrice || 0,
    clientName: initialData?.clientName || "",
    status: initialData?.status || "New",
    commission: initialData?.commission || 20,
  });

  // Format the selling price for display
  const [displayPrice, setDisplayPrice] = useState(
    formData.sellingPrice ? formatCurrency(formData.sellingPrice) : ""
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyInput(rawValue);
    setFormData({ ...formData, sellingPrice: numericValue });
    setDisplayPrice(rawValue);
  };

  const handlePriceBlur = () => {
    // Format the price when the input loses focus
    setDisplayPrice(
      formData.sellingPrice ? formatCurrency(formData.sellingPrice) : ""
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleInclusion = (inclusion: string) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.includes(inclusion)
        ? prev.inclusions.filter((i) => i !== inclusion)
        : [...prev.inclusions, inclusion],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Item Particulars</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                required
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
                required
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
                required
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inclusions & Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Inclusions</Label>
            <div className="grid grid-cols-2 gap-2">
              {defaultInclusions.map((inclusion) => (
                <div key={inclusion} className="flex items-center space-x-2">
                  <Checkbox
                    id={inclusion}
                    checked={formData.inclusions.includes(inclusion)}
                    onCheckedChange={() => toggleInclusion(inclusion)}
                  />
                  <Label htmlFor={inclusion}>{inclusion}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(
                value: "Like New" | "Excellent" | "Good" | "Worn"
              ) => setFormData({ ...formData, condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Worn">Worn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (₱)</Label>
              <Input
                id="sellingPrice"
                value={displayPrice}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                placeholder="₱0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                value={formData.commission}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    commission: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                max="100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "New" | "Processing" | "Listed" | "Sold"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Listed">Listed</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Save Consignment</Button>
      </div>
    </form>
  );
}
