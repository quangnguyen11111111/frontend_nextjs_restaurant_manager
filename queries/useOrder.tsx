import orderApiRequest from "@/apiRequest/orders";
import {
  GetOrdersQueryParamsType,
  UpdateOrderDetailBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApiRequest.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderDetailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderDetailId,
      ...body
    }: { orderDetailId: number } & UpdateOrderDetailBodyType) =>
      orderApiRequest.updateOrderDetail(orderDetailId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateSessionStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      orderApiRequest.updateSessionStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
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

export const usePayForGuestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApiRequest.pay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
