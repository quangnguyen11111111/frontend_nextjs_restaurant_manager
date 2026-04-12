import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "../share/dark-mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

function NavItems({ className }: { className?: string }) {
  return menuItems.map((item) => {
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}

const Header = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Big boy</span>
        </Link>
        <NavItems className="text-muted-foreground transition-colors hover:text-foreground shrink-0" />
      </nav>
      <div className="shrink-0 md:hidden flex items-center">
        <Sheet>
          {/* CHỈ DÙNG ĐÚNG 1 THẺ SheetTrigger NÀY THÔI 👇 */}
          <SheetTrigger
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Menu</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="">Big boy</span>
              </Link>

              <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="ml-auto">
        <DarkModeToggle />
      </div>
    </header>
  );
};
export default Header;
