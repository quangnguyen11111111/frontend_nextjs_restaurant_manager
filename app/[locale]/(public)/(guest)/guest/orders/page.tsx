import OrdersCart from "./orders-cart";

export default function OrdersPage() {
  return (
    <div className='min-h-screen bg-[#0f2f2b] py-12'>
      <div className='max-w-3xl mx-auto px-4'>
        <div className="text-center mb-8">
          <h1 className='text-3xl md:text-4xl font-serif font-bold italic text-white'>Đơn Hàng Của Bạn</h1>
          <div className="mt-3 h-1 w-24 bg-[#d4a373] mx-auto rounded-full"></div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-8 border border-white/10 shadow-2xl min-h-[400px]">
          <OrdersCart />
        </div>
      </div>
    </div>
  )
}
