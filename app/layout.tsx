import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { ReactNode } from "react";
import {TRPCProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewTube",
  description: "Clone YouTube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
      <ClerkProvider afterSignOutUrl="/">
          <html lang="en">
            <body
                className={inter.className}
            >
              <TRPCProvider>
                {/*<ThemeProvider attribute="class" defaultTheme="dark">*/}
                  <Toaster />
                  {children}
                {/*</ThemeProvider>*/}
              </TRPCProvider>
            </body>
          </html>
      </ClerkProvider>
  );
}
