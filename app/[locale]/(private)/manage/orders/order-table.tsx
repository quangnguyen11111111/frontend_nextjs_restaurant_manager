"use client";
import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
  GetOrdersResType,
  PayGuestOrdersResType
} from "@/schemaValidations/order.schema";
import EditOrder from "./edit-order";
import AddOrder from "./add-order";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/share/auto-pagination";
import { formatCurrency, handleErrorApi, getVietnameseOrderStatus } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/components/query-provider";
import { OrderStatusValues, SessionStatusValues } from "@/constants/type";
import OrderStatics from "./order-statics";
import orderTableColumns from "./order-table-columns";
import { useOrderService } from "./order.service";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfDay, format, startOfDay } from "date-fns";
import { useGetOrderListQuery, useUpdateSessionStatusMutation } from "@/queries/useOrder";
import { useListTableQuery } from "@/queries/useTable";
// import TableSkeleton from '@/app/manage/orders/table-skeleton'
// import { toast } from '@/components/ui/use-toast'
// import { GuestCreateOrdersResType } from '@/schemaValidations/guest.schema'

export const OrderTableContext = createContext({
  setOrderIdEdit: (value: number | undefined) => {},
  orderIdEdit: undefined as number | undefined,
  changeStatus: (payload: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number] | (typeof SessionStatusValues)[number];
    quantity: number;
  }) => {},
  orderObjectByGuestId: {} as OrderObjectByGuestID,
});

export type StatusCountObject = Record<
  (typeof SessionStatusValues)[number],
  number
>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export default function OrderTable() {
  const searchParam = useSearchParams();
  const t = useTranslations("SessionStatus");
  const tOrderStatus = useTranslations("OrderStatus");
  const socket = useAppStore((state) => state.socket);
  const queryClient = useQueryClient();
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const orderListQuery = useGetOrderListQuery({
    fromDate,
    toDate,
  });
  const orderList = orderListQuery.data?.payload.data ?? [];
  const tableListQuery = useListTableQuery();
  const tableList = tableListQuery.data?.payload.data ?? [];
  const tableListSortedByNumber = tableList.sort(
    (a: any, b: any) => a.number - b.number,
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });

  const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
    useOrderService(orderList);
  const updateSessionMutation = useUpdateSessionStatusMutation();

  const changeStatus = async (body: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number] | (typeof SessionStatusValues)[number];
    quantity: number;
  }) => {
    try {
      await updateSessionMutation.mutateAsync({
        orderId: body.orderId,
        status: body.status,
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const onRefetch = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    socket.on("update-order", onRefetch);
    socket.on("new-order", onRefetch);
    socket.on("payment", onRefetch);

    return () => {
      socket.off("update-order", onRefetch);
      socket.off("new-order", onRefetch);
      socket.off("payment", onRefetch);
    };
  }, [socket, queryClient]);

  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data: orderList,
    columns: orderTableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      expanded,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  return (
    <OrderTableContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
      }}
    >
      <div className="w-full">
        <div className=" flex items-center">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <span className="mr-2">Từ</span>
              <Input
                type="datetime-local"
                placeholder="Từ ngày"
                className="text-sm"
                value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setFromDate(new Date(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Đến</span>
              <Input
                type="datetime-local"
                placeholder="Đến ngày"
                value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setToDate(new Date(event.target.value))}
              />
            </div>
            <Button className="" variant={"outline"} onClick={resetDateFilter}>
              Reset
            </Button>
          </div>
          <div className="ml-auto">
            <AddOrder />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4">
          <Input
            placeholder="Tên khách"
            value={
              (table.getColumn("guestName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("guestName")?.setFilterValue(event.target.value)
            }
            className="max-w-[100px]"
          />
          <Input
            placeholder="Số bàn"
            value={
              (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("tableNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-[80px]"
          />
          <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatusFilter}
                className="w-[150px] text-sm justify-between"
              >
                {table.getColumn("status")?.getFilterValue()
                  ? t(table.getColumn("status")?.getFilterValue() as any)
                  : "Trạng thái"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  <CommandList>
                    {SessionStatusValues.map((status) => {
                      const isSelected = table.getColumn("status")?.getFilterValue() === status;
                      return (
                        <CommandItem
                          key={status}
                          value={status}
                          onSelect={(currentValue) => {
                            table
                              .getColumn("status")
                              ?.setFilterValue(
                                currentValue === table.getColumn("status")?.getFilterValue()
                                  ? ""
                                  : currentValue,
                              );
                            setOpenStatusFilter(false);
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible",
                            )}
                          >
                            <Check className={cn("h-4 w-4")} />
                          </div>
                          <span>{t(status as any)}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <OrderStatics
          statics={statics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />
        {/* <TableSkeleton /> */}
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
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
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <div className="p-4 bg-muted/20 border rounded-md m-2 space-y-2">
                            <h4 className="font-semibold mb-2">Chi Tiết Đơn Hàng (Order #{row.original.id})</h4>
                            {(row.original.order_details || []).length === 0 && (
                              <p className="text-sm text-muted-foreground">Không có món ăn nào trong đơn này.</p>
                            )}
                            {(row.original.order_details || []).map(detail => (
                              <div key={detail.id} className="flex items-center gap-4 border-b pb-2 last:border-0 last:pb-0">
                                {detail.dish_image && (
                                  <img src={detail.dish_image} alt={detail.dish_name} className="w-10 h-10 object-cover rounded-md" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{detail.dish_name}</p>
                                  <p className="text-xs text-muted-foreground">SL: {detail.quantity} - {tOrderStatus(detail.status as any)}</p>
                                </div>
                                <div className="text-sm font-semibold">{formatCurrency(detail.dish_price * detail.quantity)}</div>
                                <div className="ml-auto">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrderDetail(detail)}>Sửa</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={orderTableColumns.length}
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
            <strong>{orderList.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/orders"
            />
          </div>
        </div>
      </div>
      <EditOrder
        id={selectedOrderDetail?.id}
        setId={() => setSelectedOrderDetail(null)}
        orderDetail={selectedOrderDetail}
      />
    </OrderTableContext.Provider>
  );
}
