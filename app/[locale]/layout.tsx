import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Locale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from 'next-intl/server'
import { baseOpenGraph } from "@/shared-metadata";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export async function generateMetadata({
  params
}: {
    params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Brand' })
  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('defaultTitle')
    },
    openGraph: {
      ...baseOpenGraph
    }
    // other: {
    //   'google-site-verification': 'KKr5Sgn6rrXntMUp1nDIoQR7mJQujE4BExrlgcFvGTg'
    // }
  }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const messages = await getMessages()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      ><NextIntlClientProvider messages={messages}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
