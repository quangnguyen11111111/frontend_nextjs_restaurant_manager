import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: "mon-bo",
    title: "Món bò",
    description: "Các món bò được chế biến tinh tế với hương vị đặc biệt nhất",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mon-ga",
    title: "Món gà",
    description: "Các món gà được chế biến tinh tế với hương vị đặc biệt nhất",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mon-heo",
    title: "Món heo",
    description: "Các món heo được chế biến tinh tế với hương vị đặc biệt nhất",
    image: "https://images.openai.com/static-rsc-4/Pwo_nWUgjppYx_m2KdcrJVYVtDQY2dE5WgtFUf0SpkrXmotoJp63YzgOoYDa7fk-PLDNj1q48xvk8AdOPeROKEdYnl2Xiz9nsFES504BOS_MYkG-CUF7ubPygo5nB591dOpvhVn0HQwa0CEgR3E_Vlxsz1fZOYmJ8fv6jdOrIB4?purpose=inline",
  },
  {
    id: "mon-ca",
    title: "Món cá",
    description: "Các món cá được chế biến tinh tế với hương vị đặc biệt nhất",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
];

export default function HighlightCategories() {
  return (
    <section id="highlights" className="bg-[#123c34] py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 flex flex-col items-center justify-center">
          <div className="flex items-center gap-4">
            <span className="text-[#d4a373] text-2xl">✤</span>
            <h2 className="font-serif text-4xl font-bold italic text-[#d4a373]">
              Danh mục nổi bật
            </h2>
            <span className="text-[#d4a373] text-2xl">✤</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/guest/menu?category=${category.id}`} key={category.id}>
              <div className="group relative border border-white/20 p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[#d4a373] hover:bg-white/5 cursor-pointer">
                <div className="w-32 h-32 overflow-hidden mb-6 rounded-md shadow-lg">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                  {category.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination Dots (Visual Only for now) */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <div className="w-4 h-4 bg-[#d4a373]"></div>
          <div className="w-4 h-4 border border-[#d4a373]"></div>
        </div>
      </div>
    </section>
  );
}
