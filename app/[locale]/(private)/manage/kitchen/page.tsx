"use client";

import { useEffect, useState, useRef } from "react";
import orderApiRequest from "@/apiRequest/orders";
import DishCard from "@/components/share/manage/kitchen/DishCard";
import { useAppStore } from "@/components/query-provider";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function KitchenPage() {
  const [kitchenOrders, setKitchenOrders] = useState<any[]>([]);
  const t = useTranslations("ManageKitchen");
  const socket = useAppStore((state) => state.socket);
  
  const fetchKitchenOrders = async () => {
    try {
      const res = await orderApiRequest.getKitchenOrders();
      setKitchenOrders(res.payload.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách món:", error);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

    if (!socket) return;

    // Lắng nghe socket khi có order mới
    const handleNewOrder = () => {
      fetchKitchenOrders();
      toast.info("Có order mới", {
        description: "Vui lòng kiểm tra danh sách món cần làm.",
      });
    };

    socket.on("new-order", handleNewOrder);
    socket.on("update-order", fetchKitchenOrders);
    socket.on("update-order-detail", fetchKitchenOrders);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("update-order", fetchKitchenOrders);
      socket.off("update-order-detail", fetchKitchenOrders);
    };
  }, [socket]);

  const handleMarkDone = async (orderDetailId: number) => {
    try {
      await orderApiRequest.markKitchenOrderDone(orderDetailId);
      toast.success("Đã đánh dấu hoàn thành suất ăn");
      fetchKitchenOrders();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">KDS - Giao diện Nhà Bếp</h1>
        <button 
          onClick={fetchKitchenOrders}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-secondary/80"
        >
          Làm mới
        </button>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
          <p className="text-xl">Hiện không có món nào cần chế biến</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {kitchenOrders.map((dish) => (
            <DishCard 
              key={dish.dish_id} 
              dish={dish} 
              onMarkDone={handleMarkDone} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
