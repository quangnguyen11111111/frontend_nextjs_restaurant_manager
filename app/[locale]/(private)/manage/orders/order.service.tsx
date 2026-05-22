import { OrderObjectByGuestID, ServingGuestByTableNumber, Statics } from './order-table'
import { SessionStatus } from '@/constants/type'
import { GetOrdersResType } from '@/schemaValidations/order.schema'
import { useMemo } from 'react'

export const useOrderService = (orderList: GetOrdersResType['data']) => {
  const result = useMemo(() => {
    const statics: Statics = {
      status: {
        Pending_Arrival: 0,
        Active: 0,
        Paid: 0,
        Cancelled: 0
      },
      table: {}
    }
    const orderObjectByGuestId: OrderObjectByGuestID = {}
    const guestByTableNumber: ServingGuestByTableNumber = {}
    orderList.forEach((order) => {
      if(order.status) {
        statics.status[order.status] = (statics.status[order.status] || 0) + 1
      }
      // Nếu table và guest chưa bị xóa
      if (order.table_number !== null && order.guest_id !== null) {
        if (!statics.table[order.table_number]) {
          statics.table[order.table_number] = {}
        }
        statics.table[order.table_number][order.guest_id] = {
          ...statics.table[order.table_number]?.[order.guest_id],
          [order.status]: (statics.table[order.table_number]?.[order.guest_id]?.[order.status] ?? 0) + 1
        }
      }

      // Tính toán cho orderObjectByGuestId
      if (order.guest_id) {
        if (!orderObjectByGuestId[order.guest_id]) {
          orderObjectByGuestId[order.guest_id] = []
        }
        orderObjectByGuestId[order.guest_id].push(order)
      }

      // Tính toán cho guestByTableNumber
      if (order.table_number && order.guest_id) {
        if (!guestByTableNumber[order.table_number]) {
          guestByTableNumber[order.table_number] = {}
        }
        guestByTableNumber[order.table_number][order.guest_id] = orderObjectByGuestId[order.guest_id]
      }
    })

    // Cần phải lọc lại 1 lần nữa mới chuẩn
    // Những guest nào mà không còn phục vụ nữa sẽ bị loại bỏ
    const servingGuestByTableNumber: ServingGuestByTableNumber = {}
    for (const tableNumber in guestByTableNumber) {
      const guestObject = guestByTableNumber[tableNumber]
      const servingGuestObject: OrderObjectByGuestID = {}
      for (const guestId in guestObject) {
        const guestOrders = guestObject[guestId]
        const isServingGuest = guestOrders.some((order) =>
          order.status === SessionStatus.Active || order.status === SessionStatus.Pending_Arrival
        )
        if (isServingGuest) {
          servingGuestObject[Number(guestId)] = guestOrders
        }
      }
      if (Object.keys(servingGuestObject).length) {
        servingGuestByTableNumber[Number(tableNumber)] = servingGuestObject
      }
    }
    return {
      statics,
      orderObjectByGuestId,
      servingGuestByTableNumber
    }
  }, [orderList])
  return result
}
