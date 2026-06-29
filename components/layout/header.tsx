"use client";
import { useState, useEffect } from "react";
import { Menu, Search, User, MapPin, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn, handleErrorApi } from "@/lib/utils";
import { Role } from "@/constants/type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "../query-provider";
import { useCartStore } from "@/store/cartStore";
import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  title: string;
  href: string;
  role?: any[];
};

const menuItems: MenuItem[] = [
  { title: "Trang chủ", href: "/" },
  { title: "Giới thiệu", href: "/about" },
  { title: "Menu", href: "/guest/menu" },
  { title: "Đơn hàng", href: "/guest/orders", role: [Role.Guest] },
  { title: "Món ăn nổi bật", href: "/#highlights" },
  { title: "Tin tức", href: "/#news" },
  { title: "Quản lý", href: "/manage/dashboard", role: [Role.Owner, Role.Employee] },
];

function NavItems({ className, onClick }: { className?: string; onClick?: () => void }) {
  const role = useAppStore((state) => state.role);
  
  return (
    <>
      {menuItems.map((item) => {
        const isAuth = item.role && role && item.role.includes(role);
        const canShow = !item.role || isAuth;
        if (canShow) {
          return (
            <Link 
              href={item.href} 
              key={item.href} 
              onClick={onClick}
              className={cn("text-sm font-semibold uppercase tracking-wider text-white/90 hover:text-amber-500 transition-colors", className)}
            >
              {item.title}
            </Link>
          );
        }
        return null;
      })}
    </>
  );
}

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/vi";
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  
  const cartQuantity = useCartStore((state) => state.getTotalQuantity());
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <header
      className={cn(
        "z-50 w-full transition-all duration-300",
        isHome ? "absolute top-0 left-0 bg-transparent" : "sticky top-0 bg-[#0f2f2b] shadow-md"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a373] text-[#0f2f2b]">
            <span className="font-serif text-xl font-bold italic">Dola</span>
          </div>
          <span className="font-serif text-2xl font-bold italic text-white hidden lg:block">
            Restaurant
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavItems />
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 text-white/90 lg:flex">
            <button className="hover:text-amber-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="hover:text-amber-500 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {cartQuantity}
                </span>
              )}
            </Link>
            {role ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="hover:text-amber-500 transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Đăng xuất</AlertDialogTitle>
                    <AlertDialogDescription>Bạn có chắc chắn muốn đăng xuất không?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={logout}>Đồng ý</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Link href="/login" className="hover:text-amber-500 transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}
            <button className="hover:text-amber-500 transition-colors">
              <MapPin className="h-5 w-5" />
            </button>
          </div>

          {!role && (
            <div className="flex items-center gap-2">
              <Link href="/recover">
                <Button variant="outline" className="rounded-full px-6 font-semibold text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-white transition-colors">
                  Bạn đã có hoá đơn
                </Button>
              </Link>
              <Link href="/book">
                <Button className="rounded-full bg-[#ff9a00] px-6 font-semibold text-white hover:bg-orange-600 transition-colors border-0">
                  Đặt bàn
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="text-white hover:text-amber-500">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0f2f2b] text-white border-none w-[280px]">
                <SheetHeader>
                  <VisuallyHidden>
                    <SheetTitle>Menu</SheetTitle>
                  </VisuallyHidden>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4 px-6">
                  <NavItems className="text-sm" onClick={() => setIsMobileMenuOpen(false)} />
                  <div className="mt-4 flex gap-6 text-white/90">
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                      <Search className="h-5 w-5" />
                    </button>
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative hover:text-amber-500 transition-colors">
                      <ShoppingCart className="h-5 w-5" />
                      {mounted && cartQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                          {cartQuantity}
                        </span>
                      )}
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">
                      <User className="h-5 w-5" />
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
