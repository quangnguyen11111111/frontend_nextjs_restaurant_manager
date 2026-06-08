"use client";

import { useAppStore } from "@/components/query-provider";
import { Badge } from "@/components/ui/badge";

import { OrderStatus } from "@/constants/type";
import { formatCurrency } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
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
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            {order.dish_image && (
              <Image
                src={order.dish_image}
                alt={order.dish_name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dish_name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dish_price)} x{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {t(order.status as any)}
            </Badge>
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 ">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>{orders.length > 0 && (orders[0] as any).order?.status === 'Paid' ? 'Đã thanh toán' : 'Đơn chưa thanh toán'} · {waitingForPaying.quantity} món</span>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </div>
      </div>
    </>
  );
}
