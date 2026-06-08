"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import Link from "next/link";
import RelatedDishes from "@/components/layout/guest/RelatedDishes";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function DishDetail({
  dish,
  relatedDishes,
}: {
  dish: DishResType["data"];
  relatedDishes: DishListResType["data"];
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "policy">("description");
  const addToCart = useCartStore((state) => state.addToCart);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(dish.id, quantity);
    toast.success("Đã thêm món vào giỏ hàng");
  };

  return (
    <div className="w-full bg-[#0f2f2b] min-h-screen text-white pb-20">
      {/* Breadcrumb Area */}
      <div className="bg-[#123c34] px-4 md:px-10 py-4 text-sm font-medium">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>&gt;</span>
          <Link href="/#menu" className="hover:text-white transition-colors">Món ăn nổi bật</Link>
          <span>&gt;</span>
          <span className="text-[#d4a373]">{dish.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 mt-10">
        {/* Main Product Info */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 p-2">
            <div className="w-full h-full relative rounded-lg overflow-hidden bg-white">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col pt-4">
            <h1 className="font-serif text-4xl font-bold italic text-white mb-4">
              {dish.name}
            </h1>
            <p className="text-3xl font-bold text-red-500 mb-6">
              {formatCurrency(dish.price)}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="text-sm text-slate-300 mb-2 font-semibold">Số lượng:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-[#d4a373] text-white font-bold rounded hover:bg-[#c39160] transition-colors"
                >
                  -
                </button>
                <div className="w-12 h-10 flex items-center justify-center bg-white text-black font-bold rounded">
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-[#d4a373] text-white font-bold rounded hover:bg-[#c39160] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button onClick={handleAddToCart} className="bg-[#d4a373] text-[#0f2f2b] font-bold px-6 py-3 rounded hover:bg-[#c39160] transition-colors flex-1 sm:flex-none whitespace-nowrap">
                THÊM VÀO GIỎ HÀNG
              </button>
              <Link href="/book" className="bg-red-600 text-white font-bold px-6 py-3 rounded hover:bg-red-700 transition-colors flex-1 sm:flex-none text-center whitespace-nowrap">
                ĐẶT BÀN TẠI ĐÂY
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex border-b border-white/20">
            <button
              className={`px-8 py-3 font-bold text-sm uppercase transition-all ${
                activeTab === "description"
                  ? "text-[#d4a373] border-b-2 border-[#d4a373]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setActiveTab("description")}
            >
              MÔ TẢ MÓN ĂN
            </button>
            <button
              className={`px-8 py-3 font-bold text-sm uppercase transition-all ${
                activeTab === "policy"
                  ? "text-[#d4a373] border-b-2 border-[#d4a373]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setActiveTab("policy")}
            >
              CHÍNH SÁCH
            </button>
          </div>

          <div className="py-8 text-slate-300 space-y-6">
            {activeTab === "description" ? (
              <div className="space-y-6">
                <p className="leading-relaxed">
                  {dish.description || "Đang cập nhật mô tả cho món ăn này."}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Chính sách giao hàng và đổi trả</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Giao hàng trong vòng 30 phút.</li>
                  <li>Đổi trả miễn phí nếu món ăn không đúng yêu cầu.</li>
                  <li>Chỉ áp dụng cho các đơn hàng trong bán kính 5km.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Dishes Section */}
        {relatedDishes && relatedDishes.length > 0 && (
          <RelatedDishes items={relatedDishes.filter((d) => d.id !== dish.id).slice(0, 5)} />
        )}
      </div>
    </div>
  );
}
