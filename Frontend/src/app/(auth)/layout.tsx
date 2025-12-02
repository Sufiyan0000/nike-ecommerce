// src/app/(auth)/layout.tsx
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-light-100 md:flex-row">
      {/* Left hero / brand panel */}
      <aside className="relative flex min-h-[40vh] flex-col justify-between bg-dark-900 px-6 py-6 text-light-100 md:min-h-screen md:w-1/2 lg:px-12 lg:py-10">
        {/* Logo */}
        <div className="flex items-center gap-3 ">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-light-100">
            <Image
              src="/logo.svg" // white logo works great on dark background
              alt="Nike logo"
              width={24}
              height={24}
              className="h-5 w-7 invert"
              priority
            />
          </div>
        </div>

        {/* Hero copy */}
        <div className="space-y-4 md:space-y-6 flex flex-col items-center text-center">
          <h1 className="text-heading-3 leading-[30px] font-bold md:text-heading-2 md:leading-[60px]">
            Just Do It
          </h1>
          <p className="max-w-md text-body text-light-300">
            Join millions of athletes and fitness enthusiasts who trust Nike
            for their performance needs.
          </p>

          {/* Simple carousel dots */}
          <div className="flex gap-2 pt-2">
            <span className="h-2 w-2 rounded-full bg-light-100" />
            <span className="h-2 w-2 rounded-full bg-light-300/60" />
            <span className="h-2 w-2 rounded-full bg-light-300/40" />
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-footnote text-dark-500 md:mt-0">
          © {new Date().getFullYear()} Nike. All rights reserved.
        </p>
      </aside>

      {/* Right panel – form area */}
      <main className="flex flex-1 items-center justify-center bg-light-100 px-4 py-8 md:px-8 lg:px-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
