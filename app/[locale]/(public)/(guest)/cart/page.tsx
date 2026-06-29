"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import dishApiRequest from "@/apiRequest/dish";
import { formatCurrency, handleErrorApi } from "@/lib/utils";
import Image from "next/image";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useAppStore } from "@/components/query-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const role = useAppStore((state) => state.role);
  const socket = useAppStore((state) => state.socket);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const dishDetailQueries = useQueries({
    queries: mounted ? cart.map((item) => ({
      queryKey: ["dish-detail", item.dishId],
      queryFn: () => dishApiRequest.getDetail(item.dishId),
    })) : [],
  });

  const handleOrder = async () => {
    if (role !== "Guest") {
      toast.error("Bạn cần đặt bàn hoặc đăng nhập trước khi gọi món!");
      router.push("/book");
      return;
    }

    try {
      const res = await mutateAsync(cart);
      if (res.payload.data) {
        // Observer trên backend sẽ tự động emit sự kiện new-order
      }
      toast.success("Đặt món thành công!");
      clearCart();
      router.push(`/guest/orders`);
    } catch (error) {
      handleErrorApi({
        error,
      });
      toast.error("Đặt món thất bại!");
    }
  };

  if (!mounted) {
    return <div className="min-h-[50vh] bg-[#123c34]"></div>;
  }

  const isEmpty = cart.length === 0;

  return (
    <div className="w-full bg-[#123c34] min-h-[60vh] text-white pb-20">
      {/* Breadcrumb Area */}
      <div className="bg-[#0f2f2b] px-4 md:px-10 py-4 text-sm font-medium border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>&gt;</span>
          <span className="text-[#d4a373]">Giỏ hàng</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 mt-10">
        <h1 className="text-2xl font-semibold mb-10">Giỏ hàng của bạn</h1>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-80">
            <ShoppingBag className="w-24 h-24 mb-6 stroke-1" />
            <p className="text-lg">Không có sản phẩm nào trong giỏ hàng của bạn</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              {cart.map((item, index) => {
                const query = dishDetailQueries[index];
                if (!query || query.isLoading) {
                  return <div key={item.dishId} className="h-24 bg-white/5 animate-pulse rounded-lg"></div>;
                }
                const dish = query.data?.payload.data;
                if (!dish) return null;

                return (
                  <div key={item.dishId} className="flex gap-4 border border-white/10 rounded-lg p-4 bg-[#0f2f2b]">
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded overflow-hidden">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{dish.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.dishId)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#d4a373] text-white font-bold rounded hover:bg-[#c39160] transition-colors"
                          >
                            -
                          </button>
                          <div className="w-10 text-center">{item.quantity}</div>
                          <button
                            onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#d4a373] text-white font-bold rounded hover:bg-[#c39160] transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-amber-500">
                          {formatCurrency(dish.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary Box */}
            <div className="w-full lg:w-[350px]">
              <div className="border border-white/10 rounded-lg p-6 bg-[#0f2f2b] sticky top-24">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                <div className="flex justify-between mb-4 pb-4 border-b border-white/10">
                  <span className="text-slate-300">Tổng sản phẩm</span>
                  <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mb-6 text-amber-500">
                  <span>Tổng cộng</span>
                  <span>
                    {formatCurrency(
                      cart.reduce((total, item, index) => {
                        const dish = dishDetailQueries[index]?.data?.payload.data;
                        return total + (dish?.price || 0) * item.quantity;
                      }, 0)
                    )}
                  </span>
                </div>
                <button 
                  onClick={handleOrder}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                  disabled={cart.length === 0}
                >
                  ĐẶT MÓN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
