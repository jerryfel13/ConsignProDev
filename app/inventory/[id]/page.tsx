"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

type Product = {
  stock_external_id: string;
  product_external_id: string;
  category: {
    code: string;
    name: string;
  };
  brand: {
    code: string;
    name: string;
  };
  name: string;
  material: string;
  hardware: string;
  code: string;
  measurement: string;
  model: string;
  authenticator: {
    code: string;
    name: string;
  };
  inclusions: string[];
  images: string[];
  condition: {
    interior: string;
    exterior: string;
    overall: string;
    description: string;
  } | null;
  cost: string;
  price: string;
  stock: {
    min_qty: number;
    qty_in_stock: number;
    sold_stock: number;
  };
  is_consigned: boolean;
  consignor?: {
    code: string;
    first_name: string;
    last_name: string;
  };
  consignor_selling_price?: string;
  consigned_date?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
};

export default function ItemDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { id } = params;
  const [showMore, setShowMore] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://lwphsims-uat.up.railway.app/products/id/${id}`);
        
        if (response.data.status.success) {
          setProduct(response.data.data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError("Failed to fetch product details");
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8 text-red-500">{error || "Product not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header: Back, Main Info, Actions */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="ml-2 text-lg font-semibold">{product.name}</span>
          <Badge variant="secondary" className="ml-2">{product.category.name}</Badge>
          <span className="ml-2 text-gray-500">{product.brand.name}</span>
          <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
            Qty: {product.stock.qty_in_stock}
          </span>
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/inventory/${product.stock_external_id}/edit`)}
            >
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
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 21l-6-6-3 3-4-4-3 3" />
                </svg>
              )}
            </div>
            {/* Details */}
            <div className="flex-1 space-y-8">
              {/* Product Info */}
              <div>
                <div className="font-semibold text-base mb-2">Product Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-medium">{product.name}</span></div>
                  <div><span className="text-gray-500">Brand:</span> <span className="font-medium">{product.brand.name}</span></div>
                  <div><span className="text-gray-500">Category:</span> <span className="font-medium">{product.category.name}</span></div>
                  <div><span className="text-gray-500">Model:</span> <span className="font-medium">{product.model}</span></div>
                  <div><span className="text-gray-500">Material:</span> <span className="font-medium">{product.material}</span></div>
                  <div><span className="text-gray-500">Hardware:</span> <span className="font-medium">{product.hardware}</span></div>
                  <div><span className="text-gray-500">Measurement:</span> <span className="font-medium">{product.measurement}</span></div>
                  <div><span className="text-gray-500">Code:</span> <span className="font-medium">{product.code}</span></div>
                </div>
              </div>
              <hr className="my-2" />
              {/* Pricing & Stock */}
              <div>
                <div className="font-semibold text-base mb-2">Pricing & Stock</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Cost:</span> <span className="font-medium">₱{Number(product.cost).toLocaleString()}</span></div>
                  <div><span className="text-gray-500">Price:</span> <span className="font-medium">₱{Number(product.price).toLocaleString()}</span></div>
                  <div><span className="text-gray-500">Consigned:</span> <span className="font-medium">{product.is_consigned ? "Yes" : "No"}</span></div>
                  <div><span className="text-gray-500">Stock:</span> <span className="font-medium">{product.stock.qty_in_stock}</span></div>
                  <div><span className="text-gray-500">Minimum Qty:</span> <span className="font-medium">{product.stock.min_qty}</span></div>
                  <div><span className="text-gray-500">Items Sold:</span> <span className="font-medium">{product.stock.sold_stock}</span></div>
                  {product.is_consigned && product.consignor && (
                    <>
                      <div><span className="text-gray-500">Consignor:</span> <span className="font-medium">{product.consignor.first_name} {product.consignor.last_name}</span></div>
                      <div><span className="text-gray-500">Consignor Price:</span> <span className="font-medium">₱{Number(product.consignor_selling_price).toLocaleString()}</span></div>
                    </>
                  )}
                </div>
              </div>
              <hr className="my-2" />
              {/* Auth & Condition */}
              <div>
                <div className="font-semibold text-base mb-2">Authentication & Condition</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">Authenticator:</span> <span className="font-medium">{product.authenticator.name}</span></div>
                  {product.condition && (
                    <>
                      <div><span className="text-gray-500">Interior:</span> <span className="font-medium">{product.condition.interior}</span></div>
                      <div><span className="text-gray-500">Exterior:</span> <span className="font-medium">{product.condition.exterior}</span></div>
                      <div><span className="text-gray-500">Overall:</span> <span className="font-medium">{product.condition.overall}</span></div>
                      {product.condition.description && (
                        <div><span className="text-gray-500">Description:</span> <span className="font-medium">{product.condition.description}</span></div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <hr className="my-2" />
              {/* Inclusions */}
              <div>
                <div className="font-semibold text-base mb-2">Inclusions</div>
                <div className="flex flex-wrap gap-2">
                  {product.inclusions && product.inclusions.length > 0 ? (
                    product.inclusions.map((inc: string) => (
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
                    <div>Stock ID: {product.stock_external_id}</div>
                    <div>Product ID: {product.product_external_id}</div>
                    <div>Created: {new Date(product.created_at).toLocaleString()}</div>
                    <div>Last Updated: {new Date(product.updated_at).toLocaleString()}</div>
                    <div>Created By: {product.created_by}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 