import Link from "next/link";
import {Package2 } from "lucide-react";
import DarkModeToggle from "@/components/share/dark-mode-toggle";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col relative ">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 mx-20 max-md:mx-1">
        <nav className=" font-medium flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Big boy</span>
          </Link>
          <div className="">Trang đăng nhập</div>
        </nav>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </header>
      <main className="max-h-[calc(100vh-4rem)] overflow-hidden">
        {children}
      </main>
    </div>
  );
}
