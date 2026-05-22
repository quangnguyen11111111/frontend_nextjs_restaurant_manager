'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GetOrdersResType } from '@/schemaValidations/order.schema'
import { useContext } from 'react'
import { formatDateTimeToLocaleString, simpleMatchText } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SessionStatus, SessionStatusValues } from '@/constants/type'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { OrderTableContext } from './order-table'
import OrderGuestDetail from './order-guest-detail'
import { useTranslations } from 'next-intl'

type OrderItem = GetOrdersResType['data'][0]
const orderTableColumns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: 'tableNumber',
    header: 'Bàn',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="p-1 h-6 w-6"
        >
          {row.getIsExpanded() ? '▼' : '▶'}
        </Button>
        {row.getValue('tableNumber')}
      </div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(String(row.getValue(columnId)), String(filterValue))
    }
  },
  {
    id: 'guestName',
    header: 'Khách hàng',
    cell: function Cell({ row }) {
      const { orderObjectByGuestId } = useContext(OrderTableContext)
      const guest = row.original.guest
      return (
        <div>
          {!guest && (
            <div>
              <span>Đã bị xóa</span>
            </div>
          )}
          {guest && (
            <Popover>
              <PopoverTrigger>
                <div>
                  <span>{guest.name}</span>
                  <span className='font-semibold'>(#{guest.id})</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-[320px] sm:w-[440px]'>
                <OrderGuestDetail guest={guest} order={row.original} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(row.original.guest?.name ?? 'Đã bị xóa', String(filterValue))
    }
  },
  {
    id: 'detailsCount',
    header: 'Số món',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Badge variant='outline'>
          {row.original.order_details?.length ?? 0} món
        </Badge>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: function Cell({ row }) {
      const t = useTranslations('SessionStatus')
      const { changeStatus } = useContext(OrderTableContext)
      const changeOrderStatus = async (status: (typeof SessionStatusValues)[number]) => {
        changeStatus({
          orderId: row.original.id,
          dishId: 0, // No longer applies to a specific dish
          status: status,
          quantity: 0
        })
      }
      return (
        <Select
          onValueChange={(value: (typeof SessionStatusValues)[number]) => {
            changeOrderStatus(value)
          }}
          defaultValue={SessionStatus.Active}
          value={row.getValue('status')}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {SessionStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {t(status as any)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
  },
  {
    id: 'orderHandlerName',
    header: 'Người xử lý',
    cell: ({ row }) => <div>{''}</div>
  },
  {
    accessorKey: 'created_at',
    header: () => <div>Tạo/Cập nhật</div>,
    cell: ({ row }) => (
      <div className='space-y-2 text-sm'>
        <div className='flex items-center space-x-4'>{formatDateTimeToLocaleString(row.getValue('created_at'))}</div>
        <div className='flex items-center space-x-4'>
          {formatDateTimeToLocaleString(row.original.updated_at as unknown as string)}
        </div>
      </div>
    )
  }
]

export default orderTableColumns
