import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import clsx from "clsx";
import Header from "@/components/shell/header";
import Footer from "@/components/shell/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Epitech | Modules Tek5",
  description: "List of modules for Tek5 students at Epitech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "h-screen")}>
        <Header />
        <main className="p-5">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
