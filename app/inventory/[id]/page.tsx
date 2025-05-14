"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Item = {
  id: string;
  category: string;
  brand: string;
  name: string;
  model: string;
  material: string;
  hardware: string;
  measurement: string;
  code: string;
  authenticator: string;
  condition: string;
  cost: number;
  price: number;
  consigned: boolean;
  color: string;
  stock: number;
  inclusions: string[];
  barcode: string;
  itemsSold: number;
  minQty: number;
  unit: string;
};

const mockItems: Item[] = [
  {
    id: "1",
    category: "Bag",
    brand: "Louis Vuitton",
    name: "Neverfull MM",
    model: "MM",
    material: "Canvas",
    hardware: "Gold",
    measurement: "32x29x17cm",
    code: "LV-NF-001",
    authenticator: "Entrupy",
    condition: "Excellent",
    cost: 120.0,
    price: 1000.0,
    consigned: true,
    color: "Red",
    stock: 10,
    inclusions: ["Dust Bag", "Box", "Authentication Cards"],
    barcode: "454533",
    itemsSold: 2,
    minQty: 1,
    unit: "-",
  },
  // Add more mock items as needed
];

export default function ItemDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { id } = params;
  const [showMore, setShowMore] = useState(false);
  // Find the item by id (mock)
  const item = mockItems.find((i: Item) => i.id === id) || mockItems[0];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header: Back, Main Info, Actions */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="ml-2 text-lg font-semibold">{item.name}</span>
          <Badge variant="secondary" className="ml-2">{item.category}</Badge>
          <span className="ml-2 text-gray-500">{item.brand}</span>
          <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">Qty: {item.stock}</span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" /> Edit Item
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Update stock
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="w-60 h-48 bg-gray-100 flex items-center justify-center rounded mb-4 md:mb-0">
              <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 21l-6-6-3 3-4-4-3 3" />
              </svg>
            </div>
            {/* Details */}
            <div className="flex-1 space-y-8">
              {/* Product Info */}
              <div>
                <div className="font-semibold text-base mb-2">Product Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-medium">{item.name}</span></div>
                  <div><span className="text-gray-500">Brand:</span> <span className="font-medium">{item.brand}</span></div>
                  <div><span className="text-gray-500">Category:</span> <span className="font-medium">{item.category}</span></div>
                  <div><span className="text-gray-500">Model:</span> <span className="font-medium">{item.model}</span></div>
                  <div><span className="text-gray-500">Material:</span> <span className="font-medium">{item.material}</span></div>
                  <div><span className="text-gray-500">Hardware:</span> <span className="font-medium">{item.hardware}</span></div>
                  <div><span className="text-gray-500">Measurement:</span> <span className="font-medium">{item.measurement}</span></div>
                  <div><span className="text-gray-500">Color:</span> <span className="font-medium">{item.color}</span></div>
                  <div><span className="text-gray-500">Code:</span> <span className="font-medium">{item.code}</span></div>
                </div>
              </div>
              <hr className="my-2" />
              {/* Pricing & Stock */}
              <div>
                <div className="font-semibold text-base mb-2">Pricing & Stock</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Cost:</span> <span className="font-medium">PHP {item.cost.toFixed(2)}</span></div>
                  <div><span className="text-gray-500">Price:</span> <span className="font-medium">PHP {item.price.toFixed(2)}</span></div>
                  <div><span className="text-gray-500">Consigned:</span> <span className="font-medium">{item.consigned ? "Yes" : "No"}</span></div>
                  <div><span className="text-gray-500">Stock:</span> <span className="font-medium">{item.stock}</span></div>
                  <div><span className="text-gray-500">Minimum Qty:</span> <span className="font-medium">{item.minQty}</span></div>
                  <div><span className="text-gray-500">Items Sold:</span> <span className="font-medium">{item.itemsSold}</span></div>
                  <div><span className="text-gray-500">Unit:</span> <span className="font-medium">{item.unit}</span></div>
                  <div><span className="text-gray-500">Barcode:</span> <span className="font-medium">{item.barcode}</span></div>
                </div>
              </div>
              <hr className="my-2" />
              {/* Auth & Condition */}
              <div>
                <div className="font-semibold text-base mb-2">Authentication & Condition</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Authenticator:</span> <span className="font-medium">{item.authenticator}</span></div>
                  <div><span className="text-gray-500">Condition:</span> <span className="font-medium">{item.condition}</span></div>
                </div>
              </div>
              <hr className="my-2" />
              {/* Inclusions */}
              <div>
                <div className="font-semibold text-base mb-2">Inclusions</div>
                <div className="flex flex-wrap gap-2">
                  {item.inclusions && item.inclusions.length > 0 ? (
                    item.inclusions.map((inc: string) => (
                      <span key={inc} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium border">{inc}</span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">None</span>
                  )}
                </div>
              </div>
              {/* Show additional details toggle */}
              <div className="mt-4">
                <button type="button" className="text-blue-600 text-sm flex items-center" onClick={() => setShowMore((v) => !v)}>
                  {showMore ? "Hide additional details" : "Show additional details"}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showMore && (
                  <div className="mt-2 text-xs text-gray-600">
                    <div>Debug ID: {item.id}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">
          Learn more about <a href="#" className="text-blue-600 underline">Inventory</a>
        </div>
      </div>
    </div>
  );
} 