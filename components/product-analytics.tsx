"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data - replace with actual API data later
const topSellingData = [
  { name: "Gucci Bag", sales: 45 },
  { name: "LV Wallet", sales: 38 },
  { name: "Prada Shoes", sales: 32 },
  { name: "Hermes Belt", sales: 28 },
  { name: "Chanel Purse", sales: 25 },
];

const notSellingData = [
  { name: "Vintage Watch", days: 120 },
  { name: "Designer Scarf", days: 90 },
  { name: "Leather Jacket", days: 85 },
  { name: "Gold Bracelet", days: 75 },
  { name: "Silver Ring", days: 60 },
];

const lowStockData = [
  { name: "Dior Bag", stock: 2 },
  { name: "YSL Clutch", stock: 3 },
  { name: "Fendi Wallet", stock: 3 },
  { name: "Balenciaga Shoes", stock: 4 },
  { name: "Celine Purse", stock: 4 },
];

export function ProductAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px] w-full"
          >
            <BarChart
              data={topSellingData}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={90} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="sales"
                fill="var(--color-sales)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Not Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              days: {
                label: "Days in Stock",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px] w-full"
          >
            <BarChart
              data={notSellingData}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={90} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="days"
                fill="var(--color-days)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              stock: {
                label: "Stock Level",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[200px] w-full"
          >
            <BarChart
              data={lowStockData}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={90} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="stock"
                fill="var(--color-stock)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
} 