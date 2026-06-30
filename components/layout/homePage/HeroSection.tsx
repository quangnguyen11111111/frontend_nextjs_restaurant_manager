"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/components/query-provider";

export default function HeroSection() {
  const role = useAppStore((state) => state.role);

  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0f2f2b]/90" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 font-serif text-5xl font-bold italic tracking-wider md:text-7xl lg:text-8xl">
          HQ restaurant
        </h1>
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-[#d4a373] md:w-24"></div>
          <p className="text-lg font-medium tracking-widest text-[#d4a373] uppercase md:text-xl">
            Món ăn đa dạng
          </p>
          <div className="h-[1px] w-12 bg-[#d4a373] md:w-24"></div>
        </div>
        {!role ? (
          <Link href="/book">
            <Button className="rounded-full bg-[#ff9a00] px-8 py-6 text-lg font-bold uppercase tracking-wide text-white hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,154,0,0.4)] border-0">
              ĐẶT BÀN NGAY
            </Button>
          </Link>
        ) : (
          <Link href="/guest/menu">
            <Button className="rounded-full bg-[#ff9a00] px-8 py-6 text-lg font-bold uppercase tracking-wide text-white hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,154,0,0.4)] border-0">
              XEM MENU
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
