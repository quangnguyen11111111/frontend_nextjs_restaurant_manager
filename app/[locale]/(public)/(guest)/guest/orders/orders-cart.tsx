"use client";

import { useAppStore } from "@/components/query-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { OrderStatus } from "@/constants/type";
import { formatCurrency, handleErrorApi } from "@/lib/utils";
import { useGuestGetOrderListQuery, useGuestCancelOrderDetailMutation, useGuestCancelOrderMutation } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderDetailResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function OrdersCart() {
  const t = useTranslations("OrderStatus");
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders =  data?.payload.data ?? []
  
  const socket = useAppStore((state) => state.socket);
  const cancelOrderDetailMutation = useGuestCancelOrderDetailMutation();
  const cancelOrderMutation = useGuestCancelOrderMutation();

  const handleCancelOrder = async () => {
    try {
      await cancelOrderMutation.mutateAsync();
      toast.success("Đã huỷ đơn thành công");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const canCancel = orders.length > 0 && 
    orders.every((order) => order.status === OrderStatus.Pending || order.status === OrderStatus.Cancelled) && 
    orders.some(o => o.status === OrderStatus.Pending);

  const { waitingForPaying, paid } = useMemo(() => {
    
    return orders.reduce(
      (result, order) => {
        if (order.status !== OrderStatus.Cancelled) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dish_price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      },
    );
  }, [orders]);

  const handleCancelOrderDetail = async (orderDetailId: number) => {
    try {
      await cancelOrderDetailMutation.mutateAsync(orderDetailId);
      toast.success("Đã huỷ món thành công");
      refetch();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderDetailResType["data"]) {
      const {
        dish_name: name,
        quantity,
        status,
      } = data;
      toast.success(`Đơn ${name} x${quantity} đã chuyển sang trạng thái: ${t(status as any)}`);
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data;
      toast.success(`Đơn của khách ${guest?.name} đã được thanh toán`);
      refetch();
    }

    socket?.on("update-order", onUpdateOrder);
    socket?.on("payment", onPayment);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);
  return (
    <div className="flex flex-col gap-4 relative">
      {orders.length === 0 && (
        <div className="text-center text-white/50 py-10 font-medium">Bạn chưa có đơn hàng nào.</div>
      )}
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4 items-center bg-[#1a403a]/50 p-4 rounded-xl border border-white/5 hover:border-[#d4a373]/50 transition-colors shadow-sm">
          <div className="text-lg font-bold text-[#d4a373] w-6 text-center">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            {order.dish_image && (
              <Image
                src={order.dish_image}
                alt={order.dish_name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-lg shadow-md border border-white/10"
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-base md:text-lg font-semibold text-white">{order.dish_name}</h3>
            <div className="text-sm text-white/80 flex items-center gap-2">
              {formatCurrency(order.dish_price)} <span className="text-[#ff9a00]">x</span>{" "}
              <Badge className="px-2 bg-[#d4a373] text-[#0f2f2b] hover:bg-[#d4a373]/90 border-none font-bold">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex flex-col justify-center items-end gap-2">
            <Badge variant={"outline"} className="border-[#ff9a00] text-[#ff9a00] bg-[#ff9a00]/10 px-3 py-1 font-medium shadow-inner">
              {t(order.status as any)}
            </Badge>
            {order.status === OrderStatus.Pending && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-red-400 hover:text-red-500 hover:bg-red-400/10"
                onClick={() => handleCancelOrderDetail(order.id)}
                disabled={cancelOrderDetailMutation.isPending}
              >
                Huỷ món
              </Button>
            )}
          </div>
        </div>
      ))}

      {orders.length > 0 && (
        <div className="sticky bottom-4 mt-6 z-10 flex flex-col gap-2">
          {canCancel && (
            <Button 
              onClick={handleCancelOrder} 
              variant="destructive" 
              className="w-full h-12 text-lg font-bold shadow-lg"
              disabled={cancelOrderMutation.isPending}
            >
              Huỷ đơn
            </Button>
          )}
          <div className="w-full flex items-center justify-between p-6 rounded-xl bg-[#d4a373] text-[#0f2f2b] shadow-2xl border border-[#c19263]">
            <span className="text-lg md:text-xl font-bold font-serif">
              {orders.length > 0 && (orders[0] as any).order?.status === 'Paid' ? 'Đã thanh toán' : 'Tổng cộng'} ({waitingForPaying.quantity} món)
            </span>
            <span className="text-xl md:text-2xl font-bold">{formatCurrency(waitingForPaying.price)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
