import Header from "@/components/layout/header";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col relative ">
      <Header />
      {children}
    </div>
  );
}
