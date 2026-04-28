"use client";

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import {
  AccountListResType,
  AccountType,
} from "@/schemaValidations/account.schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditEmployee from "./edit-employee";
import { createContext, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import AddEmployee from "./add-employee";
import AutoPagination from "@/components/share/auto-pagination";
import { AlertDialogDeleteAccount } from "@/components/share/manage/accounts/AlertDialogDeleteAccount";
import { useGetAccountListQuery } from "@/queries/useAccount";

type AccountItem = AccountListResType["data"][0];

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number | undefined) => void;
  employeeIdEdit: number | undefined;
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}>({
  setEmployeeIdEdit: (value: number | undefined) => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (value: AccountItem | null) => {},
});

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-25 h-25 rounded-md object-cover">
          <AvatarImage src={row.getValue("avatar")} />
          <AvatarFallback className="rounded-none">
            {row.original.name}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEmployeeIdEdit, setEmployeeDelete } =
        useContext(AccountTableContext);
      const openEditEmployee = () => {
        setEmployeeIdEdit(row.original.id);
      };

      const openDeleteEmployee = () => {
        setEmployeeDelete(row.original);
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
            <DropdownMenuItem onClick={openEditEmployee}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteEmployee}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AccountTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(
    null,
  );
  const { data: accountListData, isPending, isError } =
    useGetAccountListQuery(currentPage);
  const data = accountListData?.payload.data ?? [];
  const paginationMeta = accountListData?.payload.pagination;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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
  return (
    <AccountTableContext.Provider
      value={{
        employeeIdEdit,
        setEmployeeIdEdit,
        employeeDelete,
        setEmployeeDelete,
      }}
    >
      <div className="w-full">
        <EditEmployee
          id={employeeIdEdit}
          setId={setEmployeeIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteAccount
          employeeDelete={employeeDelete}
          setEmployeeDelete={setEmployeeDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddEmployee />
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
              {isPending ? (
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
            Hiển thị <strong>{data.length}</strong> trong{" "}
            <strong>{paginationMeta?.totalItems ?? 0}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={paginationMeta?.page ?? currentPage}
              pageSize={Math.max(paginationMeta?.totalPages ?? 1, 1)}
              pathname="/manage/accounts"
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  );
}
