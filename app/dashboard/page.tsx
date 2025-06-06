"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentClients } from "@/components/recent-clients";
import { RecentConsignments } from "@/components/recent-consignments";
import { Overview } from "@/components/overview";
import { ProductAnalytics } from "@/components/product-analytics";
import axios from "axios";
import dayjs from "dayjs";

// Utility function to format currency in PHP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface ClientStats {
  totalCount: string;
  todayCount: string;
  yesterdayCount: string;
  lastWeekCount: string;
  lastMonthCount: string;
  lastYearCount: string;
}

// Add product stats interfaces
interface ProductStats {
  totalCount: string;
  todayCount: string;
  yesterdayCount: string;
  lastWeekCount: string;
  lastMonthCount: string;
  lastYearCount: string;
}

export default function Home() {
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Celebrants state
  const [celebrants, setCelebrants] = useState<any[]>([]);
  const [celebrantsLoading, setCelebrantsLoading] = useState(true);
  const [celebrantsError, setCelebrantsError] = useState<string | null>(null);

  // Product stats state
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [productStatsLoading, setProductStatsLoading] = useState(true);
  const [productStatsError, setProductStatsError] = useState<string | null>(null);

  // Consigned product stats state
  const [consignedProductStats, setConsignedProductStats] = useState<ProductStats | null>(null);
  const [consignedProductStatsLoading, setConsignedProductStatsLoading] = useState(true);
  const [consignedProductStatsError, setConsignedProductStatsError] = useState<string | null>(null);

  // Consignment count state
  const [consignmentCount, setConsignmentCount] = useState<string | null>(null);
  const [consignmentCountLoading, setConsignmentCountLoading] = useState(true);
  const [consignmentCountError, setConsignmentCountError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientStats = async () => {
      try {
        const response = await axios.get('https://lwphsims-uat.up.railway.app/clients/stats/counts');
        if (response.data.status.success) {
          setClientStats(response.data.data);
        } else {
          setError('Failed to fetch client statistics');
        }
      } catch (err) {
        setError('Failed to fetch client statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchClientStats();
  }, []);

  useEffect(() => {
    const fetchCelebrants = async () => {
      setCelebrantsLoading(true);
      setCelebrantsError(null);
      try {
        const month = new Date().getMonth() + 1;
        const response = await axios.post('https://lwphsims-uat.up.railway.app/clients/celebrant', { month });
        if (response.data.status.success) {
          setCelebrants(response.data.data);
        } else {
          setCelebrantsError('Failed to fetch celebrants');
        }
      } catch (err) {
        setCelebrantsError('Failed to fetch celebrants');
      } finally {
        setCelebrantsLoading(false);
      }
    };
    fetchCelebrants();
  }, []);

  useEffect(() => {
    // Fetch product stats
    const fetchProductStats = async () => {
      setProductStatsLoading(true);
      setProductStatsError(null);
      try {
        const response = await axios.get('https://lwphsims-uat.up.railway.app/products/stats/counts');
        if (response.data.status.success) {
          setProductStats(response.data.data);
        } else {
          setProductStatsError('Failed to fetch product statistics');
        }
      } catch (err) {
        setProductStatsError('Failed to fetch product statistics');
      } finally {
        setProductStatsLoading(false);
      }
    };
    // Fetch consigned product stats
    const fetchConsignedProductStats = async () => {
      setConsignedProductStatsLoading(true);
      setConsignedProductStatsError(null);
      try {
        const response = await axios.get('https://lwphsims-uat.up.railway.app/products/stats/counts?isconsigned=true');
        if (response.data.status.success) {
          setConsignedProductStats(response.data.data);
        } else {
          setConsignedProductStatsError('Failed to fetch consigned product statistics');
        }
      } catch (err) {
        setConsignedProductStatsError('Failed to fetch consigned product statistics');
      } finally {
        setConsignedProductStatsLoading(false);
      }
    };
    // Fetch consignment count (reuse client stats endpoint for now, or replace with correct one if available)
    const fetchConsignmentCount = async () => {
      setConsignmentCountLoading(true);
      setConsignmentCountError(null);
      try {
        // If you have a specific endpoint for consignment count, replace this URL
        const response = await axios.get('https://lwphsims-uat.up.railway.app/consignments/stats/counts');
        if (response.data.status.success) {
          setConsignmentCount(response.data.data.totalCount);
        } else {
          setConsignmentCountError('Failed to fetch consignment count');
        }
      } catch (err) {
        setConsignmentCountError('Failed to fetch consignment count');
      } finally {
        setConsignmentCountLoading(false);
      }
    };
    fetchProductStats();
    fetchConsignedProductStats();
    fetchConsignmentCount();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-2 sm:p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Client Statistics
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col h-32 justify-between">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-red-500">Error loading data</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{clientStats?.totalCount || '0'} Total Clients</div>
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">+{clientStats?.todayCount || '0'}</span>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">+{clientStats?.yesterdayCount || '0'}</span>
                      <span>Yesterday</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">+{clientStats?.lastWeekCount || '0'}</span>
                      <span>This Week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">+{clientStats?.lastMonthCount || '0'}</span>
                      <span>This Month</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Product Count
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col h-32 justify-between">
              {productStatsLoading ? (
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : productStatsError ? (
                <div className="text-xs text-red-500">{productStatsError}</div>
              ) : (
                <div>
                  <div className="text-2xl font-bold">{productStats?.totalCount || '0'} All</div>
                  <div className="text-xs mt-1">{consignedProductStatsLoading ? '...' : consignedProductStatsError ? 'Error' : `${consignedProductStats?.totalCount || '0'} Consigned`}</div>
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2">+{productStats?.todayCount || '0'} today</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Month Celebrants
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-32 justify-between">
              {celebrantsLoading ? (
                <div className="text-xs text-muted-foreground">Loading...</div>
              ) : celebrantsError ? (
                <div className="text-xs text-red-500">{celebrantsError}</div>
              ) : celebrants.length === 0 ? (
                <div className="text-xs text-muted-foreground">No celebrants this month.</div>
              ) : (
                <ul className="text-xs space-y-1">
                  {celebrants.map((c) => (
                    <li key={c.id}>
                      {c.first_name} {c.last_name} - {dayjs(c.birth_date).format('MMM D')}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card className="col-span-full overflow-hidden">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Product Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ProductAnalytics />
            </CardContent>
          </Card>
          <Card className="col-span-full overflow-hidden">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] w-full">
                  <Overview />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
