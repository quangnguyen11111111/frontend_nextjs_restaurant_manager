import { DishListResType } from "@/schemaValidations/dish.schema";
import MenuCard from "./MenuCard";

export default function MenuSection({
  items,
}: {
  items: DishListResType["data"];
}) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <h3 className="text-3xl font-bold text-center mb-10">Our Menu</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
