'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GetOrdersResType } from '@/schemaValidations/order.schema'
import { useContext, useMemo } from 'react'
import { formatDateTimeToLocaleString, simpleMatchText } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SessionStatus, SessionStatusValues, OrderStatus } from '@/constants/type'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { OrderTableContext } from './order-table'
import OrderGuestDetail from './order-guest-detail'
import { useTranslations } from 'next-intl'
import { TablesDialog } from './tables-dialog'
import { OrderStateFactory } from '@/lib/patterns/state/OrderState'

type OrderItem = GetOrdersResType['data'][0]
export const useOrderTableColumns = () => {
  const t = useTranslations('Orders');
  return useMemo<ColumnDef<OrderItem>[]>(() => [
  {
    accessorKey: 'table_number',
    header: t('tableNumber'),
    cell: function Cell({ row }) {
      const { checkIn } = useContext(OrderTableContext)
      const tableNumber = row.original.table_number
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => row.toggleExpanded()}
            className="p-1 h-6 w-6"
          >
            {row.getIsExpanded() ? '▼' : '▶'}
          </Button>
          {tableNumber ? (
            tableNumber
          ) : (
            <TablesDialog 
              targetGuestCount={row.original.guest_count}
              onChoose={(tables) => checkIn({ orderId: row.original.id, table_number: tables.map(t => t.number) })}
            >
              <Button variant="outline" size="sm">Chọn bàn</Button>
            </TablesDialog>
          )}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(String(row.getValue(columnId)), String(filterValue))
    }
  },
  {
    id: 'guestName',
    header: t('guestName'),
    cell: function Cell({ row }) {
      const { orderObjectByGuestId } = useContext(OrderTableContext)
      const guest = row.original.guest
      const reservationTime = row.original.reservation_time
      
      return (
        <div>
          {!guest && (
            <div>
              <span>{row.original.customer_name ? row.original.customer_name : 'Đã bị xóa'}</span>
            </div>
          )}
          {guest && (
            <Popover>
              <PopoverTrigger>
                <div className="flex flex-col items-start gap-1">
                  <div>
                    <span>{guest.name}</span>
                    <span className='font-semibold ml-1'>(#{guest.id})</span>
                  </div>
                  {row.original.guest_count > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Số khách: {row.original.guest_count} người
                    </div>
                  )}
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
    header: t('detailsCount'),
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
    header: t('status'),
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
      const currentStatus = row.getValue('status') as string
      const orderState = OrderStateFactory.getState(currentStatus)
      const orderDetails = row.original.order_details || []
      const hasCookingOrDelivered = orderDetails.some(
        d => d.status === OrderStatus.Processing || d.status === OrderStatus.Delivered
      )

      // Chỉ giữ lại trạng thái hiện tại và trạng thái Cancelled (nếu thoả mãn điều kiện)
      const allowedTransitions = orderState.getAllowedTransitions().filter(status => {
        if (status === currentStatus) return true
        if (status === SessionStatus.Cancelled) {
          return orderState.canCancel() && !hasCookingOrDelivered
        }
        return false
      })

      return (
        <Select
          onValueChange={(value: (typeof SessionStatusValues)[number]) => {
            changeOrderStatus(value)
          }}
          defaultValue={currentStatus}
          value={currentStatus}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {allowedTransitions.map((status) => (
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
    header: t('orderHandlerName'),
    cell: ({ row }) => <div>{''}</div>
  },
  {
    id: 'time',
    header: () => <div>{t('time')}</div>,
    cell: ({ row }) => {
      const reservationTime = row.original.reservation_time
      const createdAt = row.original.created_at
      const updatedAt = row.original.updated_at
      return (
        <div className='space-y-2 text-sm'>
          <div className='flex items-center space-x-4'>
            {reservationTime ? (
              <span className="font-semibold text-primary">Đến: {formatDateTimeToLocaleString(reservationTime as unknown as string)}</span>
            ) : (
              <span>Tạo: {formatDateTimeToLocaleString(createdAt as unknown as string)}</span>
            )}
          </div>
          <div className='flex items-center space-x-4'>
            <span className="text-muted-foreground">Cập nhật: {formatDateTimeToLocaleString(updatedAt as unknown as string)}</span>
          </div>
        </div>
      )
    }
  }
  ], [t]);
}
