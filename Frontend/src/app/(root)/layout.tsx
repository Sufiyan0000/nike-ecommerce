// src/app/(root)/layout.tsx
export const dynamic = "force-dynamic";

import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-light-100">{children}</main>
      <Footer />
    </>
  );
}
