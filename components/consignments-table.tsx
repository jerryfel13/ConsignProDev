"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Search, PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddConsignmentModal } from "./add-consignment-modal";
import { getPaginationWindow } from "@/components/ui/pagination-window";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";

// Utility function to format currency in PHP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Sample data - in a real app, this would come from your database
const data = [
  {
    id: "1",
    brand: "Louis Vuitton",
    model: "Neverfull MM",
    code: "LV-NF-001",
    color: "Damier Ebene",
    size: "MM",
    condition: "Like New",
    inclusions: ["Box", "Dust Bag", "Authentication Card"],
    client: "Jane Doe",
    clientId: "1",
    dateReceived: "2023-04-15",
    status: "New",
    sellingPrice: 145000,
    commission: "20%",
  },
  {
    id: "2",
    brand: "Rolex",
    model: "Datejust 41",
    code: "RLX-DJ-002",
    color: "Silver",
    size: "41mm",
    condition: "Excellent",
    inclusions: ["Box", "Papers", "Warranty Card"],
    client: "Robert Johnson",
    clientId: "2",
    dateReceived: "2023-04-10",
    status: "Processing",
    sellingPrice: 650000,
    commission: "25%",
  },
  {
    id: "3",
    brand: "Chanel",
    model: "Classic Flap",
    code: "CH-CF-003",
    color: "Black",
    size: "Medium",
    condition: "Good",
    inclusions: ["Dust Bag"],
    client: "Alice Smith",
    clientId: "3",
    dateReceived: "2023-04-05",
    status: "Listed",
    sellingPrice: 480000,
    value: "$5,200",
    commission: "30%",
  },
  {
    id: "4",
    title: "Rare Book Collection",
    client: "Michael Brown",
    clientId: "4",
    dateReceived: "2023-03-28",
    status: "Sold",
    value: "$3,800",
    commission: "15%",
  },
  {
    id: "5",
    title: "Mid-Century Modern Desk",
    client: "Emily Wilson",
    clientId: "5",
    dateReceived: "2023-03-22",
    status: "Listed",
    value: "$2,800",
    commission: "20%",
  },
  {
    id: "6",
    title: "Vintage Camera Set",
    client: "Sarah Johnson",
    clientId: "7",
    dateReceived: "2023-03-15",
    status: "Processing",
    value: "$3,200",
    commission: "25%",
  },
  {
    id: "7",
    title: "Collectible Coins",
    client: "Thomas Clark",
    clientId: "8",
    dateReceived: "2023-03-10",
    status: "New",
    value: "$4,800",
    commission: "20%",
  },
  {
    id: "8",
    title: "Vintage Vinyl Records",
    client: "Jennifer Adams",
    clientId: "9",
    dateReceived: "2023-03-05",
    status: "Listed",
    value: "$2,500",
    commission: "15%",
  },
  {
    id: "9",
    title: "Antique Silverware",
    client: "Jane Doe",
    clientId: "1",
    dateReceived: "2023-02-28",
    status: "Sold",
    value: "$3,800",
    commission: "20%",
  },
  {
    id: "10",
    title: "Handcrafted Pottery Collection",
    client: "Sarah Johnson",
    clientId: "7",
    dateReceived: "2023-02-20",
    status: "Sold",
    value: "$5,200",
    commission: "25%",
  },
];

const columns: ColumnDef<(typeof data)[0]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Brand
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.getValue("condition") as string;
      let variant: "default" | "secondary" | "outline" = "default";

      switch (condition) {
        case "Like New":
          variant = "default";
          break;
        case "Excellent":
          variant = "secondary";
          break;
        case "Good":
          variant = "outline";
          break;
      }

      return <Badge variant={variant}>{condition}</Badge>;
    },
  },
  {
    accessorKey: "client",
    header: "Consignor",
    cell: ({ row }) => (
      <Link
        href={`/clients/${row.original.clientId}`}
        className="hover:underline"
      >
        {row.getValue("client")}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "outline" | "destructive" =
        "default";

      switch (status) {
        case "New":
          variant = "default";
          break;
        case "Processing":
          variant = "secondary";
          break;
        case "Listed":
          variant = "outline";
          break;
        case "Sold":
          variant = "destructive";
          break;
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Selling Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("sellingPrice") as number;
      return formatCurrency(amount);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const consignment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(consignment.id)}
            >
              Copy consignment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/consignments/${consignment.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/consignments/${consignment.id}/edit`}>
                Edit consignment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/clients/${consignment.clientId}`}>
                View Consignor
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ConsignmentsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchType, setSearchType] = useState<"brand" | "code" | "client">(
    "brand"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleConsignmentAdded = () => {
    console.log(
      "New consignment added from table component, refresh data here."
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg sm:text-xl">Consignments List</CardTitle>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="h-9">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Consignment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select
                value={searchType}
                onValueChange={(value: "brand" | "code" | "client") =>
                  setSearchType(value)
                }
              >
                <SelectTrigger className="w-full sm:w-[130px] h-9">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${searchType}...`}
                  value={
                    (table.getColumn(searchType)?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(searchType)
                      ?.setFilterValue(event.target.value)
                  }
                  className="pl-8 h-9 w-full"
                />
              </div>
            </div>
            <div className="w-full">
              <Pagination>
                <PaginationContent className="flex flex-wrap justify-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        table.previousPage();
                      }}
                      aria-disabled={!table.getCanPreviousPage()}
                      className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {getPaginationWindow(table.getState().pagination.pageIndex + 1, table.getPageCount()).map((p, idx) =>
                    p === '...'
                      ? <PaginationEllipsis key={"ellipsis-" + idx} />
                      : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={table.getState().pagination.pageIndex + 1 === p}
                            onClick={e => {
                              e.preventDefault();
                              table.setPageIndex(Number(p) - 1);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        table.nextPage();
                      }}
                      aria-disabled={!table.getCanNextPage()}
                      className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          </div>
        </div>
      </CardContent>

      <AddConsignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConsignmentAdded={handleConsignmentAdded}
      />
    </Card>
  );
}
