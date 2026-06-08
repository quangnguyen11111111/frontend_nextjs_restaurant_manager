import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f2f2b] text-white py-12 px-4 md:px-6 mt-auto border-t border-emerald-900">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Logo & Info */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a373] text-[#0f2f2b]">
              <span className="font-serif text-xl font-bold italic">Dola</span>
            </div>
            <span className="font-serif text-2xl font-bold italic text-white">
              Restaurant
            </span>
          </Link>
          <p className="text-sm text-white/80 leading-relaxed">
            Nhà hàng chúng tôi luôn luôn đặt khách hàng lên hàng đầu, tận tâm phục vụ, mang lại cho khách hàng những trải nghiệm tuyệt vời nhất. Các món ăn với công thức độc quyền sẽ mang lại hương vị mới mẻ cho thực khách. Dola Restaurant xin chân thành cảm ơn.
          </p>
          <div>
            <h4 className="font-bold mb-2">Cửa hàng chính</h4>
            <ul className="text-sm text-white/80 space-y-1">
              <li>Địa chỉ: 70 Lữ Gia, phường 15, quận 11, TP.HCM</li>
              <li>Điện thoại: 1900 6750</li>
              <li>Email: support@sapo.vn</li>
            </ul>
          </div>
          <button className="bg-[#d4a373] text-[#0f2f2b] px-4 py-2 rounded font-semibold text-sm hover:bg-[#c39160] transition-colors">
            Hệ thống cửa hàng
          </button>
        </div>

        {/* Column 2: Hướng dẫn */}
        <div className="space-y-4 lg:pl-8">
          <h4 className="font-bold text-lg uppercase tracking-wider">Hướng dẫn</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Hướng dẫn mua hàng</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Hướng dẫn thanh toán</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Đăng ký thành viên</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Hỗ trợ khách hàng</Link></li>
          </ul>
        </div>

        {/* Column 3: Chính sách */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg uppercase tracking-wider">Chính sách</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Chính sách thành viên</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Chính sách thanh toán</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Hướng dẫn mua hàng</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Bảo mật thông tin cá nhân</Link></li>
            <li><Link href="#" className="hover:text-amber-500 transition-colors">Quà tặng tri ân</Link></li>
          </ul>
        </div>

        {/* Column 4: Mạng xã hội & Thanh toán */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="font-bold text-lg uppercase tracking-wider">Mạng xã hội</h4>
            <div className="flex items-center gap-4">
              <Link href="#" className="bg-white text-blue-600 h-8 w-8 flex items-center justify-center rounded hover:scale-110 transition-transform">
                <span className="font-bold text-xs">Zalo</span>
              </Link>
              <Link href="#" className="bg-white text-blue-800 h-8 w-8 flex items-center justify-center rounded hover:scale-110 transition-transform">
                <FaFacebook size={20} />
              </Link>
              <Link href="#" className="bg-white text-red-600 h-8 w-8 flex items-center justify-center rounded hover:scale-110 transition-transform">
                <FaYoutube size={20} />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-lg uppercase tracking-wider">Hình thức thanh toán</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full border-2 border-gray-800 inline-block"></span>
                TIỀN MẶT
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs font-bold text-emerald-700">
                CHUYỂN KHOẢN
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs font-bold text-blue-900 italic">
                VISA
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
