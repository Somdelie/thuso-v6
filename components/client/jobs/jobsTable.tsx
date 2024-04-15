"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Job } from "@prisma/client";
import { Country, State } from "country-state-city";
import Image from "next/image";
import { exportDataToExcel } from "@/lib/excel";
import { saveAs } from "file-saver";

export function JobsTable({ jobs }: { jobs: Job[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  type CountryNames = { [isoCode: string]: string };
  type StateNames = { [stateCode: string]: string }; // Define type for state names

  // Mapping from country codes to full names
  const countryNames: CountryNames = Country.getAllCountries().reduce(
    (acc: any, country) => {
      acc[country.isoCode] = country.name;
      return acc;
    },
    {}
  );

  // Mapping from state codes to full names
  const stateNames: StateNames = State.getAllStates().reduce(
    (acc: any, state) => {
      acc[state.isoCode] = state.name;
      return acc;
    },
    {}
  );

  //   console.log(jobs);

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "image",
      header: "Job Image",
      cell: ({ row }) => {
        const imageUrl: string | undefined = row.getValue("image");
        return imageUrl ? (
          <Image
            height={40}
            width={40}
            src={imageUrl}
            alt="Job Image"
            className="object-contain rounded"
          />
        ) : (
          <Image
            height={40}
            width={40}
            src="/placeholder.jpeg"
            alt="Job Image"
            className="object-contain rounded"
          />
        );
      },
    },

    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("title")}</div>
      ),
    },

    {
      accessorKey: "type",
      header: "Job Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "locationType",
      header: "Location Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("locationType")}</div>
      ),
    },

    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const locationValue = row.getValue("location");
        const location: string =
          typeof locationValue === "string" ? locationValue : "";
        const truncatedLocation =
          location.length > 0
            ? location.substring(0, 20) + "..."
            : "World Wide";
        return <div className="capitalize">{truncatedLocation}</div>;
      },
    },

    {
      accessorKey: "approved",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Approved
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
      cell: ({ row }) => {
        const approved: boolean | undefined = row.getValue("approved");
        const statusText = approved ? (
          <p className="text-green-600">Approved</p>
        ) : (
          <p className="text-red-600">Not Approved</p>
        );
        return <div className="capitalize">{statusText}</div>;
      },
    },
    {
      accessorKey: "isStarted",
      header: "Started",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("isStarted")}</div>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => {
        // Access the country code from the row data
        const countryCode: string | undefined = row.getValue("country");
        // Use optional chaining and nullish coalescing to handle potential null or undefined values
        const countryName: string = countryCode
          ? countryNames[countryCode] ?? countryCode
          : "";
        return <div className="capitalize">{countryName}</div>;
      },
    },

    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => {
        // Access the state code from the row data
        const stateCode: string | undefined = row.getValue("state");
        // Use optional chaining and nullish coalescing to handle potential null or undefined values
        const stateName: string = stateCode
          ? stateNames[stateCode] ?? stateCode
          : "";
        return <div className="capitalize">{stateName}</div>;
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("city")}</div>
      ),
    },

    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;

        // Define the function to handle exporting data as Excel
        const handleDownload = (
          p0: {
            id: string;
            title: string;
            type: string;
            locationType: string;
            location: string | null;
            country: string;
            state: string;
            city: string;
            image: string | null;
            salary: string | null;
            isStarted: boolean;
            isFinished: boolean;
            startedDate: Date | null;
            endDate: Date | null;
            amountPaid: number | null;
            amountClaimed: number | null;
            description: string;
            approved: boolean;
            createdAt: Date;
            updatedAt: Date;
            authorEmail: string | null;
          }[]
        ) => {
          // Convert table data to CSV format
          const csvData = table
            .getRowModel()
            .rows.map((row) => Object.values(row.original).join(","))
            .join("\n");

          // Create a Blob object with CSV data
          const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

          // Use file-saver library to trigger download
          saveAs(blob, "table_data.csv");
        };

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
              <DropdownMenuItem onClick={() => handleDownload([job])}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View/Edit job</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const data = jobs;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDownload = (
    p0: {
      id: string;
      title: string;
      type: string;
      locationType: string;
      location: string | null;
      country: string;
      state: string;
      city: string;
      image: string | null;
      salary: string | null;
      isStarted: boolean;
      isFinished: boolean;
      startedDate: Date | null;
      endDate: Date | null;
      amountPaid: number | null;
      amountClaimed: number | null;
      description: string;
      approved: boolean;
      createdAt: Date;
      updatedAt: Date;
      authorEmail: string | null;
    }[][]
  ) => {
    // Convert table data to CSV format
    const csvData = table
      .getRowModel()
      .rows.map((row) => Object.values(row.original).join(","))
      .join("\n");

    // Create a Blob object with CSV data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

    // Use file-saver library to trigger download
    saveAs(blob, "table_data.csv");
  };

  return (
    <div className="w-full pt-3">
      <div className="sm:flex gap-4 grid items-center justify-between py-4">
        <Input
          placeholder="Search for any job..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => handleDownload([jobs])}>Download Data</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap border-r text-white dark:text-gray-200 font-semibold"
                    >
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
                    <TableCell key={cell.id} className="whitespace-nowrap">
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
        <div className="space-x-2">
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
  );
}
