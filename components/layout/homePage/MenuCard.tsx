"use client";

import { DishListResType } from "@/schemaValidations/dish.schema";
import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";

export default function MenuCard({
  item,
}: {
  item: DishListResType["data"][number];
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/95 text-slate-900 shadow-[0_20px_40px_rgba(7,17,15,0.18)] transition hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 px-4 pb-4 pt-6 text-center">
        <h4 className="text-sm font-semibold leading-snug text-slate-900">
          {item.name}
        </h4>
        <p className="text-sm font-bold text-amber-600">
          {formatCurrency(item.price)}
        </p>
        <button className="mt-auto rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-400">
          Xem chi tiết
        </button>
      </div>
    </article>
  );
}
