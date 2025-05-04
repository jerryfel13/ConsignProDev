"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart3, Package, ShoppingCart } from "lucide-react";

// Mock data - replace with actual API data later
const topSellingData = [
  { name: "Gucci Bag", sales: 45, color: "#FF6B6B" },
  { name: "LV Wallet", sales: 38, color: "#4ECDC4" },
  { name: "Prada Shoes", sales: 32, color: "#45B7D1" },
  { name: "Hermes Belt", sales: 28, color: "#96CEB4" },
  { name: "Chanel Purse", sales: 25, color: "#FFEEAD" },
];

const notSellingData = [
  { name: "Vintage Watch", days: 120, color: "#FF6B6B" },
  { name: "Designer Scarf", days: 90, color: "#4ECDC4" },
  { name: "Leather Jacket", days: 85, color: "#45B7D1" },
  { name: "Gold Bracelet", days: 75, color: "#96CEB4" },
  { name: "Silver Ring", days: 60, color: "#FFEEAD" },
];

const lowStockData = [
  { name: "Dior Bag", stock: 2, color: "#FF6B6B" },
  { name: "YSL Clutch", stock: 3, color: "#4ECDC4" },
  { name: "Fendi Wallet", stock: 3, color: "#45B7D1" },
  { name: "Balenciaga Shoes", stock: 4, color: "#96CEB4" },
  { name: "Celine Purse", stock: 4, color: "#FFEEAD" },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export function ProductAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Top Selling Products
          </CardTitle>
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topSellingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="sales"
                  animationDuration={1500}
                  animationBegin={0}
                >
                  {topSellingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  wrapperStyle={{
                    fontSize: '11px',
                    color: 'hsl(var(--muted-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Not Selling Products
          </CardTitle>
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
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={true} 
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.2}
              />
              <XAxis 
                type="number" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={90}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar
                dataKey="days"
                fill="var(--color-days)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
                animationDuration={1500}
                animationBegin={0}
              >
                {notSellingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Low Stock Products
          </CardTitle>
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
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.2}
              />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar
                dataKey="stock"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                animationDuration={1500}
                animationBegin={0}
              >
                {lowStockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
} 