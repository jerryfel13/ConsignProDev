"use client";

import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  {
    name: "Jan",
    clients: 12,
    consignments: 18,
    purchasedItems: 30,
  },
  {
    name: "Feb",
    clients: 8,
    consignments: 15,
    purchasedItems: 25,
  },
  {
    name: "Mar",
    clients: 15,
    consignments: 23,
    purchasedItems: 40,
  },
  {
    name: "Apr",
    clients: 10,
    consignments: 19,
    purchasedItems: 35,
  },
  {
    name: "May",
    clients: 14,
    consignments: 28,
    purchasedItems: 50,
  },
  {
    name: "Jun",
    clients: 18,
    consignments: 32,
    purchasedItems: 60,
  },
];

const COLORS = {
  clients: "#FF6B6B",
  consignments: "#4ECDC4",
  purchasedItems: "#45B7D1",
};

export function Overview() {
  return (
    <ChartContainer
      config={{
        clients: {
          label: "New Clients",
          color: "hsl(var(--chart-1))",
        },
        consignments: {
          label: "New Consignments",
          color: "hsl(var(--chart-2))",
        },
        purchasedItems: {
          label: "Purchased Items",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 16,
            right: 24,
            bottom: 16,
            left: 24,
          }}
        >
          <defs>
            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.clients} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.clients} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorConsignments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.consignments} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.consignments} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPurchasedItems" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.purchasedItems} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.purchasedItems} stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            fontSize={11}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false}
            fontSize={11}
            width={35}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{
              fontSize: '11px',
              paddingBottom: '8px',
              paddingTop: '4px',
              color: 'hsl(var(--muted-foreground))'
            }}
          />
          <Area
            type="monotone"
            dataKey="clients"
            name="Clients"
            stroke={COLORS.clients}
            fillOpacity={1}
            fill="url(#colorClients)"
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={0}
          />
          <Area
            type="monotone"
            dataKey="consignments"
            name="Consignments"
            stroke={COLORS.consignments}
            fillOpacity={1}
            fill="url(#colorConsignments)"
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={0}
          />
          <Area
            type="monotone"
            dataKey="purchasedItems"
            name="Purchased Items"
            stroke={COLORS.purchasedItems}
            fillOpacity={1}
            fill="url(#colorPurchasedItems)"
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
