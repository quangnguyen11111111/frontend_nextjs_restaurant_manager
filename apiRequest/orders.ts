import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderDetailBodyType,
  UpdateOrderDetailResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";
const orderApiRequest = {
  getOrderList: (queryParam: GetOrdersQueryParamsType) => {
    const query = {
      ...queryParam,
      fromDate: queryParam.fromDate?.toISOString(),
      toDate: queryParam.toDate?.toISOString(),
    };
    return http.get<GetOrdersResType>(
      "/api/orders?" + queryString.stringify(query),
    );
  },
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersBodyType>("/api/orders", body),
  getOrderDetail: (orderId: number) =>
    http.get<GetOrderDetailResType>(`/api/orders/${orderId}`),
  updateOrderDetail: (orderDetailId: number, body: UpdateOrderDetailBodyType) =>
    http.put<UpdateOrderDetailResType>(`/api/orders/${orderDetailId}`, body),
  updateSessionStatus: (orderId: number, status: string) =>
    http.put<any>(`/api/orders/session/${orderId}`, { status }),
  pay: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>("/api/orders/pay", body),
  getKitchenOrders: () => http.get<any>("/api/orders/kitchen/consolidated"),
  markKitchenOrderDone: (orderDetailId: number) =>
    http.put<any>(`/api/orders/kitchen/${orderDetailId}/status`, {}),
};
export default orderApiRequest;
