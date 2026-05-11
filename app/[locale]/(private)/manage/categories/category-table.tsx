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
import { createContext, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/share/auto-pagination";
import { CategoryListResType } from "@/schemaValidations/category.schema";
import EditCategory from "./edit-category";
import AddCategory from "./add-category";
import { AlertDialogDeleteCategory } from "@/components/share/manage/categories/AlertDialogDeleteCategory";
import { useGetCategoryListQuery } from "@/queries/useCategory";
import { getVietnameseCategoryStatus } from "@/lib/utils";

type CategoryItem = CategoryListResType["data"][0];

const CategoryTableContext = createContext<{
  setCategoryIdEdit: (value: number | undefined) => void;
  categoryIdEdit: number | undefined;
  categoryDelete: CategoryItem | null;
  setCategoryDelete: (value: CategoryItem | null) => void;
}>({
  setCategoryIdEdit: (value: number | undefined) => {},
  categoryIdEdit: undefined,
  categoryDelete: null,
  setCategoryDelete: (value: CategoryItem | null) => {},
});

export const columns: ColumnDef<CategoryItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Ten",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "parent_id",
    header: "Danh muc cha",
    cell: ({ row }) => (
      <div>{(row.getValue("parent_id") as number | null) ?? "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trang thai",
    cell: ({ row }) => (
      <div>{getVietnameseCategoryStatus(row.getValue("status"))}</div>
    ),
  },
  {
    accessorKey: "order",
    header: "Thu tu",
    cell: ({ row }) => (
      <div>{(row.getValue("order") as number | null) ?? "-"}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setCategoryIdEdit, setCategoryDelete } =
        useContext(CategoryTableContext);
      const openEditCategory = () => {
        setCategoryIdEdit(row.original.id);
      };

      const openDeleteCategory = () => {
        setCategoryDelete(row.original);
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
            <DropdownMenuItem onClick={openEditCategory}>Sua</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteCategory}>
              Xoa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function CategoryTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const [categoryIdEdit, setCategoryIdEdit] = useState<number | undefined>();
  const [categoryDelete, setCategoryDelete] = useState<CategoryItem | null>(
    null,
  );
  const { data: categoryListData, isPending } =
    useGetCategoryListQuery(currentPage);
  const data = categoryListData?.payload.data ?? [];
  const paginationMeta = categoryListData?.payload.pagination;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({});

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
    },
  });

  return (
    <CategoryTableContext.Provider
      value={{
        categoryIdEdit,
        setCategoryIdEdit,
        categoryDelete,
        setCategoryDelete,
      }}
    >
      <div className="w-full">
        <EditCategory id={categoryIdEdit} setId={setCategoryIdEdit} />
        <AlertDialogDeleteCategory
          categoryDelete={categoryDelete}
          setCategoryDelete={setCategoryDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Loc ten"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddCategory />
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
            Hien thi <strong>{data.length}</strong> trong{" "}
            <strong>{paginationMeta?.totalItems ?? 0}</strong> ket qua
          </div>
          <div>
            <AutoPagination
              page={paginationMeta?.page ?? currentPage}
              pageSize={Math.max(paginationMeta?.totalPages ?? 1, 1)}
              pathname="/manage/categories"
            />
          </div>
        </div>
      </div>
    </CategoryTableContext.Provider>
  );
}
