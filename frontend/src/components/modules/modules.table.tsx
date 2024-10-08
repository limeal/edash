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
import { register } from "module";
import { SearchStudentDialog } from "../students/search-student.dialog";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirectWithCacheCleaning } from "@/actions/global";

export function ModulesTable({
  items,
  students,
  student,
}: {
  items: Module[];
  students: Student[];
  student?: string;
}) {
  const [search, setSearch] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "registered", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    ...(student ? [{ id: "registered", value: student }] : []),
  ]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      startDate: false,
      skills: false,
      activities: false,
      appointements: false,
      endDate: false,
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
    setSorting((sorting) => [
      ...sorting.filter((sort) => sort.id !== "favorite"),
      { id: "favorite", desc: false },
    ]);
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
      globalFilter: search,
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

    table.setSorting((sorting) => [
      ...sorting.filter((sort) => sort.id !== "favorite"),
      { id: "favorite", desc: false },
    ]);
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center py-4 w-full">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            onClick={() => {
              redirectWithCacheCleaning("/").then(() => {
                window.location.replace("/");
              })
            }}
          >
            Reset
          </Button>
          <SearchStudentDialog
            students={students}
            search={(email) => {
              // Redirect to the same page with the student query parameter
              redirectWithCacheCleaning(`?student=${email}`);
            }}
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
