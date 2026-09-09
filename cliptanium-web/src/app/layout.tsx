import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider"; // <-- 1. AuthProvider import kiya

export const metadata: Metadata = {
  title: "Cliptanium Dashboard",
  description: "Cliptanium Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white flex h-screen overflow-hidden">
        {/* 2. AuthProvider se apne Sidebar aur Main Content ko wrap kar diya */}
        <AuthProvider>
          {/* Left Side: Hamara Sidebar */}
          <Sidebar />
          
          {/* Right Side: Hamara Main Content */}
          <main className="flex-1 h-screen overflow-y-auto">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}