import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Asset Studio",
  description: "Multi-brand asset library and AI image generation studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <div className="flex min-h-screen bg-background text-text">
          <Sidebar />
          <main className="min-w-0 flex-1 px-10 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
