"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import { Separator } from "./ui/separator";
import { Filter as FilterIcon, RefreshCw } from "lucide-react";

const MODULE_OPTIONS = [
  "Authentication",
  "Users",
  "Client",
  "Product",
  "Sales",
];

const PAGE_SIZE = 10;

const columns = [
  {
    header: "Date/Time",
    accessorKey: "created_at",
    cell: (row: any) => dayjs(row.getValue("created_at")).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    header: "User",
    accessorKey: "user_name",
  },
  {
    header: "Module",
    accessorKey: "module",
  },
  {
    header: "Action",
    accessorKey: "action",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Ref ID",
    accessorKey: "ref_id",
  },
];

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userExternalId, setUserExternalId] = useState("");
  const [module, setModule] = useState("Authentication");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNumber, setTotalNumber] = useState(0);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    // Date range validation
    if (dateFrom && dateTo && dayjs(dateTo).isBefore(dayjs(dateFrom), 'day')) {
      setDateError('Date To cannot be before Date From');
      setLogs([]);
      setError(null);
      return;
    } else {
      setDateError(null);
    }
    // Only require userExternalId for Product module
    if (module === 'Product' && !userExternalId) {
      setLogs([]);
      setError(null);
      return;
    }
    fetchLogs();
    // eslint-disable-next-line
  }, [userExternalId, module, dateFrom, dateTo, page]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        pageNumber: page,
        displayPerPage: PAGE_SIZE,
      };
      if (module) {
        params.module = module;
        if (userExternalId) params.userExternalId = userExternalId;
      }
      if (dateFrom && dateTo) {
        params.dateFrom = dayjs(dateFrom).format("YYYY-MM-DD");
        params.dateTo = dayjs(dateTo).format("YYYY-MM-DD");
      }
      const res = await axios.get("https://lwphsims-uat.up.railway.app/logs/activity", { params });
      if (res.data.status.success) {
        setLogs(res.data.data);
        setTotalPages(res.data.meta.totalPages);
        setTotalNumber(res.data.meta.totalNumber);
      } else {
        setError("Failed to fetch logs");
      }
    } catch (err) {
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Reset filters and show all logs
  const handleReset = () => {
    setUserExternalId("");
    setModule("Authentication");
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  // Render
  return (
    <Card className="mt-8 w-full max-w-5xl mx-auto shadow-xl border border-gray-200">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-2xl font-bold tracking-tight">Audit Trail / Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">Filter Logs</span>
        </div>
        <section
          className="bg-gray-50 rounded-lg shadow-sm p-4 md:p-8 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end w-full"
          aria-label="Audit Trail Filters"
        >
          <div className="md:col-span-3 flex flex-col gap-1">
            <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="userExternalId">User External ID</label>
            <Input
              id="userExternalId"
              value={userExternalId}
              onChange={e => setUserExternalId(e.target.value)}
              placeholder="User External ID"
              className="w-full px-3 py-2 text-base rounded-md"
              aria-label="User External ID"
            />
          </div>
          <div className="md:col-span-3 flex flex-col gap-1">
            <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="module">Module</label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger className="w-full px-3 py-2 text-base rounded-md" id="module" aria-label="Module">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                {MODULE_OPTIONS.map((mod) => (
                  <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex flex-col gap-1">
            <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="dateFrom">Date From</label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom ? dayjs(dateFrom).format('YYYY-MM-DD') : ''}
              onChange={e => setDateFrom(e.target.value ? dayjs(e.target.value).toDate() : undefined)}
              className="w-full px-3 py-2 text-base rounded-md"
              aria-label="Date From"
              max={dateTo ? dayjs(dateTo).format('YYYY-MM-DD') : undefined}
            />
          </div>
          <div className="md:col-span-3 flex flex-col gap-1">
            <label className="block text-xs font-semibold mb-1 text-gray-700" htmlFor="dateTo">Date To</label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo ? dayjs(dateTo).format('YYYY-MM-DD') : ''}
              onChange={e => setDateTo(e.target.value ? dayjs(e.target.value).toDate() : undefined)}
              className="w-full px-3 py-2 text-base rounded-md"
              aria-label="Date To"
              min={dateFrom ? dayjs(dateFrom).format('YYYY-MM-DD') : undefined}
            />
          </div>
          {dateError && (
            <div className="md:col-span-12 text-red-500 text-sm mt-1">{dateError}</div>
          )}
          <div className="md:col-span-12 flex gap-2 mt-2 md:mt-4 justify-end">
            <Button
              variant="default"
              onClick={handleReset}
              className="w-full md:w-auto flex items-center gap-2 font-semibold"
              aria-label="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>
        </section>
        <Separator className="mb-6" />
        <section className="w-full">
          <div className="overflow-x-auto rounded-md border border-gray-100">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.accessorKey || idx}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {module === 'Product' && !userExternalId ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-gray-500">Type user external id</td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center text-red-500 py-8">{error}</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-gray-400">No results.</td>
                  </tr>
                ) : (
                  logs.map((row, rowIdx) => (
                    <tr
                      key={row.id || rowIdx}
                      className={rowIdx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-50"}
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={col.accessorKey || colIdx}
                          className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap"
                        >
                          {typeof col.cell === 'function' ? col.cell({ getValue: (k: string) => row[k] }) : row[col.accessorKey]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {(module !== 'Product' || userExternalId) && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
              <div className="text-xs text-muted-foreground mb-2 md:mb-0">
                Showing {logs.length} of {totalNumber} logs
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      aria-disabled={page === 1}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        href="#"
                        isActive={page === idx + 1}
                        onClick={e => {
                          e.preventDefault();
                          handlePageChange(idx + 1);
                        }}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      aria-disabled={page === totalPages}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
} 