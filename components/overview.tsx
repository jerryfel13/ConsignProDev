"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    clients: 12,
    consignments: 18,
  },
  {
    name: "Feb",
    clients: 8,
    consignments: 15,
  },
  {
    name: "Mar",
    clients: 15,
    consignments: 23,
  },
  {
    name: "Apr",
    clients: 10,
    consignments: 19,
  },
  {
    name: "May",
    clients: 14,
    consignments: 28,
  },
  {
    name: "Jun",
    clients: 18,
    consignments: 32,
  },
]

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
      }}
      className="h-[300px]"
    >
      <BarChart
        data={data}
        margin={{
          top: 16,
          right: 16,
          bottom: 0,
          left: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="clients" fill="var(--color-clients)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="consignments" fill="var(--color-consignments)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

