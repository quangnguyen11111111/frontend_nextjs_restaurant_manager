import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#0f2f2b] py-20 px-6 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-6 text-white relative z-10">
          <div>
            <h3 className="font-serif text-[#d4a373] text-xl font-bold italic mb-2">Về Chúng Tôi!</h3>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold italic">Dola Restaurant</h2>
          </div>
          
          <p className="text-white/80 leading-relaxed text-lg max-w-xl">
            Nhà hàng chúng tôi luôn luôn đặt khách hàng lên hàng đầu, tận tâm phục vụ, mang lại cho khách hàng những trải nghiệm tuyệt vời nhất. Các món ăn với công thức độc quyền sẽ mang lại hương vị mới mẻ cho thực khách. Dola Restaurant xin chân thành cảm ơn.
          </p>
          
          <div className="pt-4">
            <Link 
              href="#menu" 
              className="inline-flex items-center text-[#d4a373] font-bold text-lg hover:text-amber-400 transition-colors group"
            >
              Xem Thêm
              <div className="ml-4 h-[2px] w-12 bg-[#d4a373] group-hover:w-16 transition-all duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Right: Image Collage */}
        <div className="relative h-[400px] lg:h-[500px] w-full">
          <div className="absolute top-0 right-[40%] w-[55%] h-[55%] overflow-hidden rounded-tl-[80px] rounded-br-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Món thịt nướng" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute top-[10%] right-0 w-[35%] h-[40%] overflow-hidden rounded-tr-[40px] rounded-bl-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Dimsum" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-[45%] w-[45%] h-[40%] overflow-hidden rounded-bl-[60px] rounded-tr-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Món cá" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-[5%] right-0 w-[40%] h-[45%] overflow-hidden rounded-br-[80px] rounded-tl-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1559742811-822873691df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Hải sản tôm" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
