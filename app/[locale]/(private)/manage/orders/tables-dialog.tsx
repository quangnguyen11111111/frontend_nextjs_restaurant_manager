import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AutoPagination from '@/components/share/auto-pagination'
import { useEffect, useState, useMemo } from 'react'

import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    targetGuestCount?: number
  }
}

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
  useReactTable
} from '@tanstack/react-table'
import { cn, getVietnameseTableStatus, simpleMatchText } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { TableListResType } from '@/schemaValidations/table.schema'
import { TableStatus } from '@/constants/type'
import { useListTableQuery } from '../../../../../queries/useTable'
import { Checkbox } from '@/components/ui/checkbox'

type TableItem = TableListResType['data'][0]

export const columns: ColumnDef<TableItem>[] = [
  {
    id: 'select',
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
        disabled={row.original.status === TableStatus.Hidden || row.original.status === TableStatus.Reserved}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'number',
    header: 'Số bàn',
    cell: ({ row }) => <div className='capitalize font-bold'>{row.getValue('number')}</div>,
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(String(row.original.number), String(filterValue))
    }
  },
  {
    accessorKey: 'capacity',
    header: 'Sức chứa',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('capacity')}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue('status'))}</div>
  },
  {
    accessorKey: 'group_id',
    header: 'Khu vực (Nhóm ghép)',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('group_id') || 'Không có'}</div>
  },
  {
    id: 'suggested_tables',
    header: 'Đề xuất ghép',
    cell: ({ row, table }) => {
      const groupId = row.original.group_id;
      const groupOrder = row.original.group_order;
      const targetCapacity = table.options.meta?.targetGuestCount || 0;

      if (!groupId || groupOrder === undefined || groupOrder === null || targetCapacity === 0) return <span className="text-muted-foreground">-</span>;
      
      if (row.original.capacity >= targetCapacity) return <span className="text-muted-foreground text-sm">Đã đủ chỗ</span>;

      const allRows = table.getCoreRowModel().rows;
      const groupTables = allRows
        .filter(r => r.original.group_id === groupId)
        .sort((a, b) => (a.original.group_order || 0) - (b.original.group_order || 0));

      const currentIndex = groupTables.findIndex(r => r.original.number === row.original.number);
      if (currentIndex === -1) return <span className="text-muted-foreground">-</span>;

      let currentCapacity = row.original.capacity;
      const suggestedTables: TableItem[] = [];

      let left = currentIndex - 1;
      let right = currentIndex + 1;

      while (currentCapacity < targetCapacity && (left >= 0 || right < groupTables.length)) {
        if (right < groupTables.length) {
          suggestedTables.push(groupTables[right].original);
          currentCapacity += groupTables[right].original.capacity;
          right++;
        } else if (left >= 0) {
          suggestedTables.push(groupTables[left].original);
          currentCapacity += groupTables[left].original.capacity;
          left--;
        }
      }

      if (currentCapacity < targetCapacity) {
         return <span className="text-red-500 font-semibold text-xs">Cả khu không đủ</span>;
      }

      if (suggestedTables.length === 0) return <span className="text-muted-foreground">-</span>;
      
      return <div className="text-[#d4a373] font-semibold">{suggestedTables.map(s => s.number).join(', ')}</div>;
    }
  }
]

const PAGE_SIZE = 10

export function TablesDialog({ onChoose, targetGuestCount, children }: { onChoose: (tables: TableItem[]) => void, targetGuestCount?: number, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const tableListQuery = useListTableQuery()
  
  // Sort data by group_id and group_order
  const data = useMemo(() => {
    const rawData = tableListQuery.data?.payload.data ?? []
    return [...rawData].sort((a, b) => {
      const groupA = a.group_id || ''
      const groupB = b.group_id || ''
      if (groupA !== groupB) return groupA.localeCompare(groupB)
      return (a.group_order || 0) - (b.group_order || 0)
    })
  }, [tableListQuery.data?.payload.data])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: PAGE_SIZE
  })

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
    meta: {
      targetGuestCount
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex: 0,
      pageSize: PAGE_SIZE
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (open) {
      tableListQuery.refetch()
      setRowSelection({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const choose = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) return
    const selectedTables = selectedRows.map(row => row.original)
    onChoose(selectedTables)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <Button variant='outline'>Thay đổi</Button>}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Chọn bàn</DialogTitle>
          <DialogDescription className="sr-only">
            Chọn bàn để ghép cho đơn hàng
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className='w-full'>
            <div className='flex items-center py-4'>
              <Input
                placeholder='Số bàn'
                value={(table.getColumn('number')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('number')?.setFilterValue(event.target.value)}
                className='w-[80px]'
              />
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn({
                          'cursor-pointer':
                            row.original.status === TableStatus.Available ||
                            row.original.status === TableStatus.Reserved,
                          'cursor-not-allowed': row.original.status === TableStatus.Hidden
                        })}
                        onClick={() => {
                          if (
                            row.original.status === TableStatus.Available ||
                            row.original.status === TableStatus.Reserved
                          ) {
                            row.toggleSelected()
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className='flex items-center justify-between space-x-2 py-4'>
              <div className='text-xs text-muted-foreground'>
                Đã chọn <strong>{table.getFilteredSelectedRowModel().rows.length}</strong> bàn
              </div>
              <div className='text-xs text-muted-foreground py-4 flex-1 text-center'>
                Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
                <strong>{data.length}</strong> kết quả
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname='/manage/Tables'
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='button' variant='secondary' onClick={() => setOpen(false)}>Hủy</Button>
          <Button 
            type='button' 
            onClick={choose} 
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          >
            Xác nhận chọn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
