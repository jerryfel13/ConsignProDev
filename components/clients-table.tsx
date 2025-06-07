"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
import { AddClientModal } from "./add-client-modal";
import axios from "axios";

const API_BASE_URL = 'https://lwphsims-uat.up.railway.app';

// Utility function to format currency in PHP
const formatCurrency = (amount: string | number) => {
  // If amount is a string with currency symbol, convert to number
  const numericValue =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
      : amount;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isConsignor: boolean;
  totalValue: string;
}

interface ClientsTableProps {
  initialClients: Client[];
  error?: string;
  loading?: boolean;
  onAddClient: () => void;
}

export function ClientsTable({ initialClients, error, loading = false, onAddClient }: ClientsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchType, setSearchType] = useState<"name" | "contact" | "id">("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Add retry effect
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 3000); // Retry every 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  const handleDeleteClient = async (clientId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          deleted_by: "admin_client"
        }
      });

      if (response.data.status?.success) {
        // Refresh the clients list
        window.location.reload();
      } else {
        // Handle specific error messages
        if (response.data.status?.message === "Cannot delete: existing transactions found.") {
          toast.error("This client cannot be deleted because they have existing transactions. Please review their transaction history first.");
        } else {
          toast.error(response.data.status?.message);
        }
      }
    } catch (error: any) {
      if (error.response?.data?.status?.message === "Cannot delete: existing transactions found.") {
        toast.error("This client cannot be deleted because they have existing transactions. Please review their transaction history first.");
      } else if (error.response?.data?.status?.message) {
        toast.error(error.response.data.status.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const columns: ColumnDef<Client>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">
        <Link href={`/clients/${row.original.id}`} className="hover:underline">
          {row.getValue("name")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isConsignor",
    header: "Consignor",
    cell: ({ row }) => {
      const isConsignor = row.getValue("isConsignor") as boolean;
      return isConsignor ? (
        <Badge variant="outline" className="bg-primary/5">
          Consignor
        </Badge>
      ) : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

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
              onClick={() => navigator.clipboard.writeText(client.id)}
            >
              Copy client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`/clients/${client.id}`}
                className="flex items-center"
              >
                <span>View Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/clients/${client.id}/edit`}
                className="flex items-center"
              >
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/clients/${client.id}/transactions`}
                className="flex items-center"
              >
                <span>View Transactions</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                  setClientToDelete(client.id);
                  setShowDeleteConfirm(true);
              }}
              className="text-red-600"
            >
              Delete Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

  const table = useReactTable({
    data: initialClients,
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
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)?.toString().toLowerCase() ?? "";
      return value.includes(filterValue.toLowerCase());
    },
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Manage Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading clients...</p>
            <p className="text-sm text-muted-foreground mt-2">Retrying in a few seconds...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Manage Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select
                value={searchType}
                onValueChange={(value: "name" | "contact" | "id") =>
                  setSearchType(value)
                }
              >
                <SelectTrigger className="w-full sm:w-[110px] h-9">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    searchType === "name"
                      ? "Search name..."
                      : searchType === "contact"
                      ? "Search email/phone..."
                      : "Search ID..."
                  }
                  value={globalFilter}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGlobalFilter(value);
                    table.setGlobalFilter(value);
                  }}
                  className="pl-8 h-9 w-full"
                />
              </div>
              <Select
                onValueChange={(value) => {
                  table
                    .getColumn("status")
                    ?.setFilterValue(value === "all" ? "" : value);
                }}
              >
                <SelectTrigger className="w-full sm:w-[120px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={onAddClient}
                size="sm"
                className="h-9"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <span className="text-muted-foreground">Loading clients...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-[90vw] max-w-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h4 className="text-center font-medium text-lg text-gray-900 mb-1">
              Confirm Delete
            </h4>
            <p className="text-center text-gray-600 mb-4">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setClientToDelete(null);
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteClient(clientToDelete);
                  setClientToDelete(null);
                }}
                className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export interface Transaction {
  id: string;
  clientId: string;
  date: Date;
  type: "Consignment" | "Purchase" | "Payment";
  amount: number;
  status: "Pending" | "Completed" | "Cancelled";
  description?: string;
}

export interface Consignment {
  id: string;
  clientId: string;
  items: ConsignmentItem[];
  totalValue: number;
  status: "Pending" | "Active" | "Sold" | "Returned";
  startDate: Date;
  endDate?: Date;
}

export interface ConsignmentItem {
  id: string;
  name: string;
  description: string;
  price: number;
  status: "Available" | "Sold" | "Returned";
}
