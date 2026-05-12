"use client";
import { DishListResType } from "@/schemaValidations/dish.schema";
import MenuCard from "./MenuCard";
import { CategoryTreeResType } from "@/schemaValidations/category.schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import dishApiRequest from "@/apiRequest/dish";
import { useGetDishListByCategoryQuery } from "@/queries/useDish";

export default function MenuSection({
  items,
  categoryPayload,
}: {
  items: DishListResType["data"];
  categoryPayload: CategoryTreeResType["data"]; // Replace 'any' with the actual type if available
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryPayload[0]?.id || null,
  );
  const { data, isLoading } = useGetDishListByCategoryQuery({
    categoryId: selectedCategoryId!,
    page: 1,
  });
  const listDish = data?.payload.data ?? items;
  return (
    <section className="relative isolate overflow-hidden bg-[#0f2f2b] px-6 py-16 text-white shadow-[0_30px_80px_rgba(8,21,18,0.4)] md:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#204c45_0%,#0f2f2b_60%)]" />
      <div className="absolute -left-12 top-1/3 -z-10 h-40 w-40 rounded-full border border-emerald-400/10" />
      <div className="absolute -right-10 bottom-16 -z-10 h-48 w-48 rounded-full border border-emerald-300/15" />

      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
          Big Boy Restaurant
        </span>
        <p className="mt-3 max-w-2xl text-sm text-emerald-100/80">
          Chọn danh mục để khám phá các món ăn đặc sắc của nhà hàng.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {categoryPayload.map((category) => (
            <button
              key={category.id}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                selectedCategoryId === category.id
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200",
              )}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          listDish?.map((item) => <MenuCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}
