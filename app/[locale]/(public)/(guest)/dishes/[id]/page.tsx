import dishApiRequest from "@/apiRequest/dish";
import DishDetail from "./DishDetail";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const dishRes = await dishApiRequest.getDetail(Number(id));
    const dish = dishRes.payload.data;
    return {
      title: `${dish.name} | Dola Restaurant`,
      description: dish.description,
    };
  } catch (error) {
    return {
      title: "Món ăn | Dola Restaurant",
    };
  }
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const dishRes = await dishApiRequest.getDetail(Number(id));
    const dish = dishRes.payload.data;

    let relatedDishes: any[] = [];
    if (dish.category_id) {
      try {
        const relatedRes = await dishApiRequest.listByCategory(dish.category_id, 1);
        relatedDishes = relatedRes.payload.data;
      } catch (error) {
        // If related fetch fails, continue without them
        console.error(error);
      }
    }

    return <DishDetail dish={dish} relatedDishes={relatedDishes} />;
  } catch (error) {
    return (
      <div className="w-full bg-[#0f2f2b] min-h-screen text-white flex items-center justify-center pb-20">
        <h1 className="text-2xl font-bold">Không tìm thấy món ăn</h1>
      </div>
    );
  }
}
