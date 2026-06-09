import orderApiRequest from "@/apiRequest/orders";
import {
  GetOrdersQueryParamsType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderID,
      ...body
    }: { orderID: number } & UpdateOrderBodyType) =>
      orderApiRequest.updateOrder(orderID, body),
  });
};

export const useGetOrderListQuery = (queryParam: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orders", queryParam],
    queryFn: () => orderApiRequest.getOrderList(queryParam),
  });
};

export const usegetOrderDetailQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
    enabled,
  });
};
