'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateOrderDetailBody, UpdateOrderDetailBodyType } from '@/schemaValidations/order.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useTranslations } from 'next-intl'
import { getVietnameseOrderStatus } from '@/lib/utils'
import { OrderStatus, OrderStatusValues } from '@/constants/type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { DishesDialog } from './dishes-dialog'
import { useUpdateOrderDetailMutation } from '@/queries/useOrder'
import { handleErrorApi } from '@/lib/utils'
import { useAppStore } from '@/components/query-provider'
import { OrderDetailStateFactory } from '@/lib/patterns/state/OrderDetailState'

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
  orderDetail
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
  orderDetail?: { status: (typeof OrderStatusValues)[number]; quantity: number } | null
}) {
  const t = useTranslations('OrderStatus')
  const updateOrderMutation = useUpdateOrderDetailMutation()
  const socket = useAppStore(state => state.socket)
  const form = useForm<UpdateOrderDetailBodyType>({
    resolver: zodResolver(UpdateOrderDetailBody),
    defaultValues: {
      status: OrderStatus.Pending,
      quantity: 1
    }
  })

  useEffect(() => {
    if (orderDetail) {
      form.reset({
        status: orderDetail.status,
        quantity: orderDetail.quantity
      })
    }
  }, [orderDetail, form])

  const onSubmit = async (values: UpdateOrderDetailBodyType) => {
    if (!id) return
    try {
      const res = await updateOrderMutation.mutateAsync({
        orderDetailId: id,
        ...values
      })
      if (res.payload.data) {
        // Observer trên backend sẽ tự động emit sự kiện update-order
      }
      reset()
      onSubmitSuccess && onSubmitSuccess()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  const reset = () => {
    setId(undefined)
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-order-form'
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='quantity'>Số lượng</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='quantity'
                          inputMode='numeric'
                          pattern='[0-9]*'
                          className={`w-16 text-center ${orderDetail?.status !== OrderStatus.Pending ? 'bg-muted pointer-events-none' : ''}`}
                          {...field}
                          value={field.value}
                          readOnly={orderDetail?.status !== OrderStatus.Pending}
                          onChange={(e) => {
                            let value = e.target.value
                            const numberValue = Number(value)
                            if (isNaN(numberValue)) {
                              return
                            }
                            field.onChange(numberValue)
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl className='col-span-3'>
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Trạng thái' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OrderStatusValues.filter((s) => {
                            const stateObj = OrderDetailStateFactory.getState(orderDetail?.status || OrderStatus.Pending);
                            if (s === stateObj.status) return true;
                            if (s === OrderStatus.Cancelled) return stateObj.canCancel();
                            return false;
                          }).map((status) => (
                            <SelectItem key={status} value={status}>
                              {t(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-order-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
