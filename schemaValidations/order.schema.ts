import { OrderStatusValues, SessionStatusValues } from '@/constants/type'
import { AccountSchema } from '@/schemaValidations/account.schema'
import { TableSchema } from '@/schemaValidations/table.schema'
import { DishSchema } from '@/schemaValidations/dish.schema'
import z from 'zod'

export const OrderDetailSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  guest_id: z.number().nullable(),
  guest: z
    .object({
      id: z.number(),
      name: z.string(),
      order_id: z.number().nullable(),
      created_at: z.date(),
      updated_at: z.date()
    })
    .nullable(),
  dish_id: z.number().nullable(),
  dish: DishSchema.nullable().optional(),
  dish_name: z.string(),
  dish_price: z.number(),
  dish_image: z.string().nullable(),
  quantity: z.number(),
  status: z.enum(OrderStatusValues),
  note: z.string().nullable(),
  order_handler_id: z.number().nullable(),
  order_handler: AccountSchema.nullable().optional(),
  created_at: z.date(),
  updated_at: z.date()
})

export const OrderSchema = z.object({
  id: z.number(),
  table_number: z.number().nullable(),
  table: TableSchema.optional(),
  tables: z.array(TableSchema).optional(),
  guest_id: z.number().nullable(), // host guest
  guest: z
    .object({
      id: z.number(),
      name: z.string(),
      order_id: z.number().nullable(),
      created_at: z.date(),
      updated_at: z.date()
    })
    .nullable()
    .optional(),
  guest_count: z.number(),
  session_pin: z.string().nullable(),
  customer_name: z.string().nullable(),
  customer_phone: z.string().nullable(),
  reservation_time: z.date().nullable(),
  status: z.enum(SessionStatusValues),
  order_details: z.array(OrderDetailSchema).optional(),
  created_at: z.date(),
  updated_at: z.date()
})

export const UpdateOrderDetailBody = z.object({
  status: z.enum(OrderStatusValues).optional(),
  quantity: z.number().optional()
})

export type UpdateOrderDetailBodyType = z.TypeOf<typeof UpdateOrderDetailBody>

export const OrderParam = z.object({
  orderId: z.coerce.number()
})

export type OrderParamType = z.TypeOf<typeof OrderParam>

export const UpdateOrderDetailRes = z.object({
  message: z.string(),
  data: OrderDetailSchema
})

export type UpdateOrderDetailResType = z.TypeOf<typeof UpdateOrderDetailRes>

export const GetOrdersQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional()
})

export type GetOrdersQueryParamsType = z.TypeOf<typeof GetOrdersQueryParams>

export const GetOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema)
})

export type GetOrdersResType = z.TypeOf<typeof GetOrdersRes>

export const GetOrderDetailRes = z.object({
  message: z.string(),
  data: OrderSchema // Returns the master order with details inside
})

export type GetOrderDetailResType = z.TypeOf<typeof GetOrderDetailRes>

export const PayGuestOrdersBody = z.object({
  guestId: z.number()
})

export type PayGuestOrdersBodyType = z.TypeOf<typeof PayGuestOrdersBody>

export const PayGuestOrdersRes = z.object({
  message: z.string(),
  data: OrderSchema
})

export type PayGuestOrdersResType = z.TypeOf<typeof PayGuestOrdersRes>

export const CreateOrdersBody = z
  .object({
    guestId: z.number(),
    tableNumber: z.number().optional(),
    orders: z.array(
      z.object({
        dishId: z.number(),
        quantity: z.number()
      })
    )
  })
  .strict()

export type CreateOrdersBodyType = z.TypeOf<typeof CreateOrdersBody>

export const CreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderDetailSchema) // Returns created order details
})

export type CreateOrdersResType = z.TypeOf<typeof CreateOrdersRes>
