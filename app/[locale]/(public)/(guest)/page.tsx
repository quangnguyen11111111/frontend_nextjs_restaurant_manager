import dishApiRequest from "@/apiRequest/dish";
import categoryApiRequest from "../../../../apiRequest/category";
import MenuSection from "@/components/layout/homePage/MenuSection";
import HeroSection from "@/components/layout/homePage/HeroSection";
import AboutSection from "@/components/layout/homePage/AboutSection";
import HighlightCategories from "@/components/layout/homePage/HighlightCategories";
import FeatureCards from "@/components/layout/homePage/FeatureCards";

export default async function Home() {
  const { payload: categoryPayload } = await categoryApiRequest.listTree(false);

  const firstCategoryId = categoryPayload.data[0]?.id;
  const items = firstCategoryId
    ? (await dishApiRequest.listByCategory(firstCategoryId, 1)).payload.data
    : [];

  return (
    <div className="w-full flex flex-col bg-[#0f2f2b]">
      <HeroSection />
      <AboutSection />
      <HighlightCategories />
      <FeatureCards />
      <MenuSection items={items} categoryPayload={categoryPayload.data} />
    </div>
  );
}
