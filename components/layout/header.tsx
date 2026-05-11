"use client";
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn, handleErrorApi } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RoleType } from "@/types/jwt.types";
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
import { useTranslations } from "next-intl";
import { useAppStore } from "../query-provider";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter } from "next/navigation";
const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "home",
    href: "/",
  },
  {
    title: "menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "orders",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "login",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "manage",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];
function NavItems({ className }: { className?: string }) {
  const t = useTranslations("NavItem");
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, "cursor-pointer")}>{t("logout")}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("logoutDialog.logoutQuestion")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("logoutDialog.logoutConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("logoutDialog.logoutCancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

const Header = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
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
