"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, use } from "react";
import Image from "next/image";

export default function ClientConsignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: consignorId } = use(params);
  const [consignments, setConsignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNumber, setTotalNumber] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(
      `https://lwphsims-uat.up.railway.app/products/consignor/${consignorId}/items?pageNumber=${page}&displayPerPage=10&sortBy=name&orderBy=asc${search ? `&searchValue=${encodeURIComponent(search)}` : ""}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status?.success) {
          setConsignments(data.data);
          setTotalPages(data.meta?.totalPages || 1);
          setTotalNumber(data.meta?.totalNumber || 0);
        } else {
          setError(data.status?.message || "Failed to fetch consignments");
        }
      })
      .catch(() => setError("Failed to fetch consignments"))
      .finally(() => setLoading(false));
  }, [consignorId, page, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="p-4 md:p-6 border-b bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Consignments</h1>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients`}>Back to Client</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto p-4 md:p-6">
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Client Consignments
              </CardTitle>
              <Button size="sm" asChild>
                <Link href={`/consignments/new?clientId=${consignorId}`}>
                  Add Consignment
                </Link>
              </Button>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="text"
                className="input input-bordered w-full sm:w-64"
                placeholder="Search by name, material, code, etc."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Image</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Brand</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Model</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Stock</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consignments.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No consignments found.</td></tr>
                    ) : (
                      consignments.map((item) => (
                        <tr key={item.stock_external_id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            {item.images && item.images.length > 0 ? (
                              <Image src={item.images[0]} alt={item.name} width={48} height={48} className="rounded-md object-cover w-12 h-12" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">👜</div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-medium">{item.name}</td>
                          <td className="py-4 px-4">{item.brand?.name}</td>
                          <td className="py-4 px-4">{item.model}</td>
                          <td className="py-4 px-4 text-right font-medium">₱{Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          <td className="py-4 px-4 text-center">{item.stock?.qty_in_stock}</td>
                          <td className="py-4 px-4 text-center">
                            <Badge
                              variant="outline"
                              className={
                                item.stock?.qty_in_stock > 0
                                  ? "bg-blue-500 text-white hover:bg-blue-500"
                                  : "bg-black text-white hover:bg-black"
                              }
                            >
                              {item.stock?.qty_in_stock > 0 ? "Listed" : "Sold"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/consignments/${item.stock_external_id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="flex justify-between items-center py-4 px-4">
                  <div className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages} ({totalNumber} items)
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₱395,000.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
