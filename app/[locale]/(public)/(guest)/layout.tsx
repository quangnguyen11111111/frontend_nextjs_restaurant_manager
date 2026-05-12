import Header from "@/components/layout/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col relative">
      <Header />
      <main className="flex flex-1 flex-col gap-4 md:gap-8">{children}</main>
    </div>
  );
}
