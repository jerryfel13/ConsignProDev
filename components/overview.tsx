"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
      <BarChart
        data={data}
        margin={{
          top: 16,
          right: 24,
          bottom: 16,
          left: 24,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          axisLine={false}
          fontSize={11}
          tickMargin={8}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false}
          fontSize={11}
          width={35}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{
            fontSize: '11px',
            paddingBottom: '8px',
            paddingTop: '4px'
          }}
        />
        <Bar
          dataKey="clients"
          name="Clients"
          fill="var(--color-clients)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="consignments"
          name="Consignments"
          fill="var(--color-consignments)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="purchasedItems"
          name="Purchased Items"
          fill="var(--color-purchasedItems)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  );
}
