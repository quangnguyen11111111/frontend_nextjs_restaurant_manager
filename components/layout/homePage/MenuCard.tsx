"use client";

import { DishListResType } from "@/schemaValidations/dish.schema";
import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function MenuCard({
  item,
}: {
  item: DishListResType["data"][number];
}) {

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-[#e8edea] rounded-2xl text-slate-900 transition-all hover:shadow-2xl shadow-md hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-square">
        <div className="w-full h-full relative overflow-hidden bg-white">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        
        {/* Heart Icon */}
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#d4a373] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg">
          <Heart size={16} fill="white" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-between gap-1 px-3 md:px-4 pb-4 md:pb-5 pt-3 text-center bg-[#e8edea]">
        <h4 className="text-sm md:text-base font-bold leading-snug text-[#0f2f2b] line-clamp-2 min-h-[40px] flex items-center justify-center">
          {item.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm md:text-base font-bold text-red-600">
            {formatCurrency(item.price)}
          </p>
        </div>
        <Link href={`/dishes/${item.id}`} className="mt-3 w-full text-center rounded-full bg-[#d4a373] px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-bold text-white shadow hover:bg-[#c39160] transition-colors inline-block active:scale-95">
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
