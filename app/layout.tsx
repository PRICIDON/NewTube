import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { ReactNode } from "react";
import {TRPCProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages, getTranslations} from "next-intl/server";
import {setLanguage} from "@/lib/i18n/language";
import {type Language} from "@/lib/i18n/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "NewTube",
//   description: "Clone YouTube",
// };

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("layouts.main")
    return {
        title: "NewTube",
        description: t("description"),
    }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();
  return (
      <ClerkProvider afterSignOutUrl="/">
          <html lang={locale} suppressHydrationWarning>
            <body
                className={inter.className}
            >
              <TRPCProvider>
                  <NextIntlClientProvider messages={messages}>
                    {/*<ThemeProvider attribute="class" defaultTheme="dark">*/}
                      <Toaster />
                      {children}
                    {/*</ThemeProvider>*/}
                  </NextIntlClientProvider>
              </TRPCProvider>
            </body>
          </html>
      </ClerkProvider>
  );
}
