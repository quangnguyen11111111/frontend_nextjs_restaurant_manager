"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { Button } from "@/components/ui/button";

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
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getTableLink, getVietnameseTableStatus } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { TableListResType } from "@/schemaValidations/table.schema";
import EditTable from "./edit-table";
import AddTable from "./add-table";
import AutoPagination from "@/components/share/auto-pagination";
import { AlertDialogDeleteTable } from "@/components/share/manage/tables/AlertDialogDeleteTable";
import { useListTableQuery } from "@/queries/useTable";
import QrCodeTable from "@/components/share/manage/tables/QrCodeTable";

type TableItem = TableListResType["data"][0];

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void;
  tableIdEdit: number | undefined;
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}>({
  setTableIdEdit: (value: number | undefined) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {},
});

export const useTableTableColumns = () => {
  const t = useTranslations("Tables");
  return useMemo<ColumnDef<TableItem>[]>(() => [
    {
      accessorKey: "number",
      header: t("number"),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("number")}</div>
      ),
      filterFn: (row, id, value) => {
        if (!value) return true;
        return String(value) === String(row.getValue("number"));
      },
    },
    {
      accessorKey: "capacity",
      header: t("capacity"),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("capacity")}</div>
      ),
    },
    {
      accessorKey: "max_capacity",
      header: t("max_capacity"),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("max_capacity") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "group_id",
      header: t("group_id"),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("group_id") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "group_order",
      header: t("group_order"),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("group_order") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => (
        <div>{getVietnameseTableStatus(row.getValue("status"))}</div>
      ),
    },
    {
      accessorKey: "token",
      header: t("qrcode"),
      cell: ({ row }) => (
        <div>
          <QrCodeTable
            token={row.getValue("token")}
            tableNumber={row.getValue("number")}
          />
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setTableIdEdit, setTableDelete } = useContext(TableTableContext);
        const openEditTable = () => {
          setTableIdEdit(row.original.number);
        };

        const openDeleteTable = () => {
          setTableDelete(row.original);
        };
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
              {/* <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [t]);
};

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function TableTable() {
  const t = useTranslations("Tables");
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const pageIndex = currentPage - 1;
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
  const tableListQuery = useListTableQuery();
  const data = tableListQuery.data?.payload.data ?? [];
  const columns = useTableTableColumns();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });
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
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <TableTableContext.Provider
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      <div className="w-full">
        <EditTable id={tableIdEdit} setId={setTableIdEdit} />
        <AlertDialogDeleteTable
          tableDelete={tableDelete}
          setTableDelete={setTableDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder={t("filterNumber")}
            value={
              (table.getColumn("number")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("number")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddTable />
          </div>
        </div>
        <div className="rounded-md border">
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
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {tableListQuery.isPending ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
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
                          cell.getContext(),
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
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/tables"
            />
          </div>
        </div>
      </div>
    </TableTableContext.Provider>
  );
}
