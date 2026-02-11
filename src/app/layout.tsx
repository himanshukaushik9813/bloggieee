import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import AppFrame from "@/components/app-frame";
import CustomCursor from "@/components/custom-cursor";
import { ThemeProvider } from "@/components/theme-provider";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogVerse - Modern Blog Platform by Himanshu Kaushik",
  description: "A modern blog platform with stunning visuals. Created and owned by Himanshu Kaushik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          <CustomCursor />
          <AppFrame>
          <Navbar />
          <main className="flex min-h-[calc(100vh-4rem)] flex-col">{children}</main>
          <SiteFooter />
          </AppFrame>
          <BackToTop />
          <Toaster richColors />
          <VisualEditsMessenger />
        </ThemeProvider>
      </body>
    </html>
  );
}
