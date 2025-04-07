"use client";

import { useState } from "react";
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
    id: string;
    brand: string;
    model: string;
    code: string;
    color: string;
    size: string;
    inclusions: string[];
    documents: string[];
    status: "Active" | "Archived" | "Returned";
    clientName: string;
    isConsigned: boolean;
    purchaseDate: Date;
    purchasePrice?: number;
    consignmentFee?: number;
  };
  onSubmit: (data: any) => void;
}

const defaultInclusions = [
  "Dust Bag",
  "Box",
  "Receipts",
  "Authentication Cards",
];

const defaultDocuments = [
  "Purchase Receipt",
  "Warranty",
  "Authentication Certificate",
];

export function ItemForm({ initialData, onSubmit }: ItemFormProps) {
  const [formData, setFormData] = useState({
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    code: initialData?.code || "",
    color: initialData?.color || "",
    size: initialData?.size || "",
    inclusions: initialData?.inclusions || [],
    documents: initialData?.documents || [],
    status: initialData?.status || "Active",
    clientName: initialData?.clientName || "",
    isConsigned: initialData?.isConsigned || false,
    purchaseDate: initialData?.purchaseDate || new Date(),
    purchasePrice: initialData?.purchasePrice || 0,
    consignmentFee: initialData?.consignmentFee || 0,
  });

  const [displayPrice, setDisplayPrice] = useState(
    formData.purchasePrice ? formatCurrency(formData.purchasePrice) : ""
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyInput(rawValue);
    setFormData({ ...formData, purchasePrice: numericValue });
    setDisplayPrice(rawValue);
  };

  const handlePriceBlur = () => {
    // Format the price when the input loses focus
    setDisplayPrice(
      formData.purchasePrice ? formatCurrency(formData.purchasePrice) : ""
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

  const toggleDocument = (document: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter((d) => d !== document)
        : [...prev.documents, document],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
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
          <CardTitle>Inclusions & Documents</CardTitle>
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
            <Label>Support Documents</Label>
            <div className="grid grid-cols-2 gap-2">
              {defaultDocuments.map((document) => (
                <div key={document} className="flex items-center space-x-2">
                  <Checkbox
                    id={document}
                    checked={formData.documents.includes(document)}
                    onCheckedChange={() => toggleDocument(document)}
                  />
                  <Label htmlFor={document}>{document}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isConsigned"
                  checked={formData.isConsigned}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isConsigned: !!checked })
                  }
                />
                <Label htmlFor="isConsigned">This item is consigned</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Active" | "Archived" | "Returned") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={format(formData.purchaseDate, "yyyy-MM-dd")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseDate: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₱)</Label>
              <Input
                id="purchasePrice"
                value={displayPrice}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                placeholder="₱0.00"
                required
              />
            </div>
            {formData.isConsigned && (
              <div className="space-y-2">
                <Label htmlFor="consignmentFee">Consignment Fee (%)</Label>
                <Input
                  id="consignmentFee"
                  type="number"
                  value={formData.consignmentFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consignmentFee: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}
