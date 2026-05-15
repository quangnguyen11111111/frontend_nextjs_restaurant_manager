import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";
const orderApiRequest = {
  getOrderList: (queryParam: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      "/api/orders?" + queryString.stringify(queryParam),
    ),
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersBodyType>("/api/orders", body),
  getOrderDetail: (orderId: number) =>
    http.get<GetOrderDetailResType>(`/api/orders/${orderId}`),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/api/orders/${orderId}`, body),
};
export default orderApiRequest;
