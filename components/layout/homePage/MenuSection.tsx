"use client";
import { DishListResType } from "@/schemaValidations/dish.schema";
import MenuCard from "./MenuCard";
import { CategoryTreeResType } from "@/schemaValidations/category.schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGetDishListByCategoryQuery } from "@/queries/useDish";

export default function MenuSection({
  items,
  categoryPayload,
}: {
  items: DishListResType["data"];
  categoryPayload: CategoryTreeResType["data"];
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
    <section id="menu" className="bg-[#123c34] py-16 px-4 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[#d4a373] text-2xl">✤</span>
          <h2 className="font-serif text-4xl font-bold italic text-[#d4a373]">
            Thực đơn của chúng tôi
          </h2>
          <span className="text-[#d4a373] text-2xl">✤</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {categoryPayload.map((category) => (
            <button
              key={category.id}
              className={cn(
                "rounded font-bold px-6 py-2 text-sm transition-all border",
                selectedCategoryId === category.id
                  ? "bg-[#d4a373] text-[#123c34] border-[#d4a373]"
                  : "bg-transparent text-white border-white hover:border-[#d4a373] hover:text-[#d4a373]",
              )}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          <div className="col-span-full flex justify-center text-white py-10">Loading...</div>
        ) : (
          listDish?.map((item) => <MenuCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}
