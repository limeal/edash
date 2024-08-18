"use client";

import * as React from "react";
import {
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
import { ChevronDown, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { columns } from "./modules.table-columns";
import { ModulesTablePagination } from "./modules.table-pagination";

export function ModulesTable({ items }: { items: Module[] }) {
  const [search, setSearch] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      startDate: false,
      appointements: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [favorites, setFavorites] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    const favorites: Record<number, boolean> = {};
    for (let i = 0; i < items.length; i++) {
      if (
        typeof window !== "undefined" &&
        window.localStorage.getItem(`favorite-module-${items[i].moduleid}`)
      )
        favorites[items[i].moduleid] = true;
    }
    setFavorites(favorites);
    setSorting((sorting) => [...sorting.filter((sort) => sort.id !== "favorite"), { id: "favorite", desc: false }]);
  }, [items]);

  const table = useReactTable({
    data: items,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableMultiSort: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const updateFavorite = (moduleId: number, favorite: boolean) => {
    if (favorite) {
      setFavorites((favorites) => ({ ...favorites, [moduleId]: true }));
      if (typeof window !== "undefined")
        window.localStorage.setItem(`favorite-module-${moduleId}`, "true");
    } else {
      if (typeof window !== "undefined")
        window.localStorage.removeItem(`favorite-module-${moduleId}`);
      setFavorites((favorites) => {
        const newFavorites = { ...favorites };
        delete newFavorites[moduleId];
        return newFavorites;
      });
    }
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            table.setGlobalFilter(event.target.value);
          }}
          className="max-w-sm"
        />
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
      <div className="rounded-md border flex flex-grow overflow-scroll">
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
                      {cell.column.id === "favorite" ? (
                        <Button
                          className="mr-2 p-1 h-fit"
                          variant="link"
                          onClick={() =>
                            updateFavorite(
                              row.original.moduleid,
                              !favorites[row.original.moduleid]
                            )
                          }
                        >
                          <Star
                            size={16}
                            fill={
                              favorites[row.original.moduleid]
                                ? "yellow"
                                : "none"
                            }
                          />
                        </Button>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
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
      <ModulesTablePagination table={table} />
    </>
  );
}
