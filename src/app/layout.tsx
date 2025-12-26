import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
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
  title: {
    default: "LMS - Learning Management System",
    template: "%s | LMS",
  },
  description: "ระบบจัดการการเรียนรู้ออนไลน์ เรียนออนไลน์ได้ทุกที่ทุกเวลา พร้อมคอร์สคุณภาพจากผู้เชี่ยวชาญ",
  keywords: ["LMS", "Learning Management System", "ระบบเรียนออนไลน์", "คอร์สออนไลน์", "เรียนออนไลน์"],
  authors: [{ name: "LMS Team" }],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "LMS - Learning Management System",
    title: "LMS - Learning Management System",
    description: "ระบบจัดการการเรียนรู้ออนไลน์ เรียนออนไลน์ได้ทุกที่ทุกเวลา",
  },
  twitter: {
    card: "summary_large_image",
    title: "LMS - Learning Management System",
    description: "ระบบจัดการการเรียนรู้ออนไลน์ เรียนออนไลน์ได้ทุกที่ทุกเวลา",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          {children}
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
