"use client";

import { DishListResType } from "@/schemaValidations/dish.schema";
import MenuCard from "../homePage/MenuCard";

export default function RelatedDishes({
  items,
}: {
  items: DishListResType["data"];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-20 border-t border-white/10 pt-16">
      <div className="flex flex-col items-center justify-center mb-10 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <svg className="w-64 h-64 text-white" viewBox="0 0 100 100">
            {/* Simple decorative element */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
          </svg>
        </div>
        <h2 className="font-serif text-4xl italic font-bold text-white z-10">Món ăn cùng loại</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
