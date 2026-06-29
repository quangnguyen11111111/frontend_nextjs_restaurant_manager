import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OrderStatus, SessionStatus } from '@/constants/type'
import {
  OrderStatusIcon,
  formatCurrency,
  formatDateTimeToLocaleString,
  formatDateTimeToTimeString,
  getVietnameseOrderStatus
} from '@/lib/utils'
import { GetOrdersResType } from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { usePayForGuestMutation } from '@/queries/useOrder'
import { useTranslations } from 'next-intl'
import { handleErrorApi } from '@/lib/utils'
import EditOrder from './edit-order'
import { useAppStore } from '@/components/query-provider'
import { OrderStateFactory } from '@/lib/patterns/state/OrderState'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Guest = NonNullable<GetOrdersResType['data'][0]['guest']>
type Order = GetOrdersResType['data'][0]
export default function OrderGuestDetail({ guest, order }: { guest: Guest; order: Order }) {
  const t = useTranslations('OrderStatus')
  const details = order.order_details || []
  const payForGuestMutation = usePayForGuestMutation()
  const socket = useAppStore(state => state.socket)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null)
  
  const orderState = OrderStateFactory.getState(order.status)
  const ordersFilterToPurchase = (guest && orderState.canPay())
    ? details.filter((detail) => detail.status !== OrderStatus.Cancelled)
    : []
  const purchasedOrderFilter = (guest && !orderState.canPay()) 
    ? details.filter((detail) => detail.status !== OrderStatus.Cancelled) 
    : []

  const pay = async () => {
    if (!guest) return
    try {
      await payForGuestMutation.mutateAsync({ guestId: guest.id })
      // Observer trên backend sẽ tự động emit sự kiện payment khi trạng thái order thay đổi.
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <div className='space-y-2 text-sm'>
      {guest && (
        <Fragment>
          <div className='space-x-1'>
            <span className='font-semibold'>Tên:</span>
            <span>{guest.name}</span>
            <span className='font-semibold'>(#{guest.id})</span>
            <span>|</span>
            <span className='font-semibold'>Bàn:</span>
            <span>{order.table_number}</span>
          </div>
          <div className='space-x-1'>
            <span className='font-semibold'>Ngày đăng ký:</span>
            <span>{formatDateTimeToLocaleString(guest.created_at)}</span>
          </div>
        </Fragment>
      )}

      <div className='space-y-1'>
        <div className='font-semibold'>Đơn hàng:</div>
        {details.map((detail, index) => {
          return (
            <div key={detail.id} className='flex gap-2 items-center text-xs'>
              <span className='w-[10px]'>{index + 1}</span>
              <span title={t(detail.status as any)}>
                {detail.status === OrderStatus.Pending && <OrderStatusIcon.Pending className='w-4 h-4' />}
                {detail.status === OrderStatus.Processing && <OrderStatusIcon.Processing className='w-4 h-4' />}
                {detail.status === OrderStatus.Cancelled && <OrderStatusIcon.Cancelled className='w-4 h-4 text-red-400' />}
                {detail.status === OrderStatus.Delivered && <OrderStatusIcon.Delivered className='w-4 h-4' />}
              </span>
              {detail.dish_image && (
                <Image
                  src={detail.dish_image}
                  alt={detail.dish_name}
                  title={detail.dish_name}
                  width={30}
                  height={30}
                  className='h-[30px] w-[30px] rounded object-cover'
                />
              )}
              <span className='truncate w-[70px] sm:w-[100px]' title={detail.dish_name}>
                {detail.dish_name}
              </span>
              <span className='font-semibold' title={`Tổng: ${detail.quantity}`}>
                x{detail.quantity}
              </span>
              <span className='italic'>{formatCurrency(detail.quantity * detail.dish_price)}</span>
              <span
                className='hidden sm:inline'
                title={`Tạo: ${formatDateTimeToLocaleString(
                  detail.created_at
                )} | Cập nhật: ${formatDateTimeToLocaleString(detail.updated_at as any)}
          `}
              >
                {formatDateTimeToLocaleString(detail.created_at)}
              </span>
              <span
                className='sm:hidden'
                title={`Tạo: ${formatDateTimeToLocaleString(
                  detail.created_at
                )} | Cập nhật: ${formatDateTimeToLocaleString(detail.updated_at as any)}
          `}
              >
                {formatDateTimeToTimeString(detail.created_at as any)}
              </span>
              <div className='ml-auto'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setSelectedOrderDetail(detail)}
                >
                  Sửa
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <div className='space-x-1'>
        <span className='font-semibold'>Chưa thanh toán:</span>
        <Badge>
          <span>
            {formatCurrency(
              ordersFilterToPurchase.reduce((acc, detail) => {
                return acc + detail.quantity * detail.dish_price
              }, 0)
            )}
          </span>
        </Badge>
      </div>
      <div className='space-x-1'>
        <span className='font-semibold'>Đã thanh toán:</span>
        <Badge variant={'outline'}>
          <span>
            {formatCurrency(
              purchasedOrderFilter.reduce((acc, detail) => {
                return acc + detail.quantity * detail.dish_price
              }, 0)
            )}
          </span>
        </Badge>
      </div>

      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className='w-full' 
              size={'sm'} 
              variant={'secondary'} 
              disabled={ordersFilterToPurchase.length === 0 || !orderState.canPay() || details.some(d => d.status === OrderStatus.Pending || d.status === OrderStatus.Processing)}
            >
              {details.some(d => d.status === OrderStatus.Pending || d.status === OrderStatus.Processing) 
                ? 'Chưa thể thanh toán do có món đang xử lý' 
                : `Thanh toán tất cả (${ordersFilterToPurchase.length} đơn)`}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn thanh toán tất cả các món đã giao cho khách hàng này không?
                Tổng tiền cần thanh toán là {formatCurrency(
                  ordersFilterToPurchase.reduce((acc, detail) => {
                    return acc + detail.quantity * detail.dish_price
                  }, 0)
                )}. Hành động này không thể hoàn tác dễ dàng.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={pay}>Đồng ý thanh toán</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <EditOrder
        id={selectedOrderDetail?.id}
        setId={() => setSelectedOrderDetail(null)}
        orderDetail={selectedOrderDetail}
      />
    </div>
  )
}
