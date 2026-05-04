import dishApiRequest from "@/apiRequest/dish";
import categoryApiRequest from "../../../apiRequest/category";
import MenuSection from "@/components/layout/homePage/MenuSection";
import Image from "next/image";

export default async function Home() {
  const { payload: categoryPayload } = await categoryApiRequest.listTree();
  const firstCategoryId = categoryPayload.data[0]?.id;
  const items = firstCategoryId
    ? (await dishApiRequest.listByCategory(firstCategoryId, 1)).payload.data
    : [];
  return (
    <div className="w-full space-y-4">
      <section className="h-[90vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1555992336-03a23c7b20ee')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to Dola</h2>
          <p className="text-gray-300 mb-6">Fine dining experience</p>
          <button className="px-6 py-3 bg-orange-500 rounded-full hover:bg-orange-600 transition">
            Explore Menu
          </button>
        </div>
      </section>
      <section className="space-y-10 py-16">
        <MenuSection items={items} />
      </section>
    </div>
  );
}
