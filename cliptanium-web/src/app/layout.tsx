import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
        {/* Left Side: Hamara Sidebar */}
        <Sidebar />
        
        {/* Right Side: Hamara Main Content */}
        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}