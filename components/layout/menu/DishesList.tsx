"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useGetDishListByCategoryQuery } from "@/queries/useDish";
import { DishStatus } from "@/constants/type";

type DishesListProps = {
  selectedCategoryId: number;
  itemsPerPage?: number;
  handleAddToCart: (dishId: number, quantity: number) => void;
};

export default function DishesList({
  selectedCategoryId,
  handleAddToCart,
}: DishesListProps) {
  const page = 1;

  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const { data: dishListData, isLoading } = useGetDishListByCategoryQuery({
    page: currentPage,
    categoryId: selectedCategoryId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl bg-white/95 text-slate-900 shadow-[0_20px_40px_rgba(7,17,15,0.18)]"
          />
        ))}
      </div>
    );
  }

  const data = dishListData?.payload.data ?? [];
  const paginationMeta = dishListData?.payload.pagination;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((dish) => {
          return (
            <article
              key={dish.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/95 text-slate-900 shadow-[0_20px_40px_rgba(7,17,15,0.18)] transition hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                {dish.status === DishStatus.Unavailable && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm font-semibold text-gray-500">
                    Hết hàng
                  </div>
                )}
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-amber-500 text-white shadow">
                  <Heart className="h-4 w-4" />
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center gap-2 px-4 pb-5 pt-8 text-center">
                <h4 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
                  {dish.name}
                </h4>
                <div className="flex items-center gap-2 text-sm font-bold text-amber-600">
                  <span>{formatCurrency(dish.price)}</span>
                </div>
                <button
                  className={cn(
                    "mt-auto rounded-full px-4 py-2 text-xs font-semibold text-white shadow transition",
                    "bg-amber-500 hover:bg-amber-400",
                    "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-60 disabled:hover:bg-gray-300",
                  )}
                  onClick={() => handleAddToCart(dish.id, 1)}
                  disabled={dish.status === DishStatus.Unavailable}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {paginationMeta && paginationMeta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-lg border border-amber-200/40 px-3 py-1 text-sm text-amber-50 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <div className="flex gap-2">
            {Array.from(
              { length: paginationMeta.totalPages },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-amber-500 text-white"
                    : "border border-amber-200/40 text-amber-50 hover:bg-amber-500/20"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="rounded-lg border border-amber-200/40 px-3 py-1 text-sm text-amber-50 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(paginationMeta.totalPages, page + 1),
              )
            }
            disabled={currentPage === paginationMeta.totalPages}
          >
            ›
          </button>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Không có món ăn trong danh mục này</p>
        </div>
      )}
    </div>
  );
}
