import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#0f2f2b] min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-[#0a221f] py-4 px-6 md:px-12 lg:px-24 border-b border-emerald-900/50 shadow-sm">
        <div className="flex items-center text-sm font-semibold max-w-7xl mx-auto">
          <Link href="/" className="text-white hover:text-[#d4a373] transition-colors">Trang chủ</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-white/70" />
          <span className="text-[#d4a373]">Giới thiệu</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-6 md:px-12 lg:px-24 text-white max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6">Giới thiệu</h1>
        
        <p className="text-white/90 leading-relaxed mb-12 text-sm md:text-base max-w-5xl">
          <span className="font-bold italic">HQ restaurant</span> - Nhà hàng ẩm thực hiện đại kết hợp với truyền thống, tạo nên tính mới lạ cho thực khách. Được ra đời vào năm 2021 với tiêu chí “Khách hàng là trên hết” nên chúng tôi luôn tự hào về cách phục vụ cũng như các món ăn mà chúng tôi làm ra. Nhà hàng chúng tôi luôn luôn đặt khách hàng lên hàng đầu, tận tâm phục vụ, mang lại cho khách hàng những trải nghiệm tuyệt vời nhất. Các món ăn với công thức độc quyền sẽ mang lại hương vị mới mẻ cho thực khách. HQ restaurant xin chân thành cảm ơn.
        </p>

        {/* Image Collage */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] w-full max-w-[700px] mb-12">
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-[55%] h-[55%] overflow-hidden rounded-tl-[80px] rounded-br-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Món thịt nướng" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Top Right */}
          <div className="absolute top-[10%] left-[58%] w-[35%] h-[40%] overflow-hidden rounded-tr-[40px] rounded-bl-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Dimsum" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-[5%] w-[45%] h-[40%] overflow-hidden rounded-bl-[60px] rounded-tr-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Món cá" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bottom Right */}
          <div className="absolute bottom-[5%] left-[52%] w-[40%] h-[45%] overflow-hidden rounded-br-[80px] rounded-tl-2xl shadow-xl transition-transform duration-500 hover:scale-105 hover:z-20">
            <img 
              src="https://images.unsplash.com/photo-1559742811-822873691df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Hải sản tôm" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <p className="font-bold text-base md:text-lg italic text-white uppercase tracking-wide">
          HÃY ĐẾN HQ restaurant ĐỂ THƯỞNG THỨC NGAY BẠN NHÉ!
        </p>
      </div>
    </div>
  );
}
