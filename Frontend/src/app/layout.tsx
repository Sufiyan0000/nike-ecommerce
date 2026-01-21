import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { AuthProvider } from "../context/AuthContext";
import CartBootstrap from "../components/CartBootstrap";

const jost: NextFontWithVariable = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nike e-commerce",
  description: "An e-commerce website for Nike shoes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased overflow-x-hidden`}>
        <AuthProvider>
          <CartBootstrap />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
