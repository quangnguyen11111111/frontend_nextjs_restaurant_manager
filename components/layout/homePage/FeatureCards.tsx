import Link from "next/link";

const features = [
  {
    title: "Món ăn đa dạng",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Thực đơn phong phú đa dạng các món ăn đặc trưng từ khắp nơi.",
  },
  {
    title: "Hương vị đặc biệt",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Những món ăn được nêm nếm theo hương vị đậm đà, khó quên.",
  },
  {
    title: "Công thức độc quyền",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Được sáng tạo bởi các đầu bếp hàng đầu với công thức riêng biệt.",
  },
];

export default function FeatureCards() {
  return (
    <section className="bg-[#0f2f2b] py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden cursor-pointer"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url('${feature.image}')` }}
            />
            
            {/* Dark Overlay that lightens slightly on hover */}
            <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/40" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {/* Inner dark box */}
              <div className="bg-[#0f2f2b]/80 p-8 w-[80%] max-w-[300px] border border-white/10 transition-all duration-500 group-hover:bg-[#0f2f2b]/90 group-hover:border-[#d4a373]/50">
                <p className="text-[#d4a373] text-sm font-semibold tracking-widest uppercase mb-2">
                  Dola Restaurant
                </p>
                <h3 className="text-white text-2xl font-bold mb-4">
                  {feature.title}
                </h3>
                
                {/* Hidden description that slides down on hover */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                  <div className="overflow-hidden">
                    <p className="text-white/80 text-sm mt-4 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
