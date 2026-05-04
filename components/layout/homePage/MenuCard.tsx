"use client";

import { DishListResType } from "@/schemaValidations/dish.schema";

export default function MenuCard({
  item,
}: {
  item: DishListResType["data"][number];
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
      />

      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
        <h4 className="text-xl font-semibold">{item.name}</h4>
        <p className="text-orange-400">{item.price}</p>
        <button className="mt-3 px-4 py-2 bg-orange-500 rounded hover:bg-orange-600">
          Order Now
        </button>
      </div>
    </div>
  );
}
