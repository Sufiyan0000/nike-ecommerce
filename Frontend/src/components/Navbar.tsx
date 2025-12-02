// src/components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logoSrc?: string;
  navItems?: NavItem[];
  cartCount?: number;
}

const defaultNavItems: NavItem[] = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

const Navbar: React.FC<NavbarProps> = ({
  logoSrc = "/logo.svg", // put your Nike-style logo in /public/logo.svg
  navItems = defaultNavItems,
  cartCount = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-neutral-200">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-2  rounded px-2 py-1">
          <Link href="/" aria-label="Home">
            <Image
              src='/logo.svg'
              alt="Brand logo"
              width={30}
              height={30}
              className="h-4 w-15 sm:h-7 invert"
              priority
            />
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-md font-medium text-dark-900 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-dark-700 font-base"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side actions (desktop) */}
        <div className="hidden items-center gap-6 text-sm font-medium text-neutral-800 lg:flex">
          <button
            type="button"
            className="transition-colors hover:text-neutral-500"
          >
            Search
          </button>
          <button
            type="button"
            className="transition-colors hover:text-neutral-500"
            aria-label={`My cart with ${cartCount} items`}
          >
            My Cart ({cartCount})
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            className="text-md font-medium text-dark-900"
          >
            Search
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 p-1.5"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <span className="block h-[2px] w-5 bg-neutral-900" />
            <span className="mt-1 block h-[2px] w-5 bg-neutral-900" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-md font-medium text-dark-900 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 transition-colors hover:text-dark-700"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-light-200 pt-3 text-dark-900">
              <button
                type="button"
                className="transition-colors hover:text-neutral-500"
              >
                Search
              </button>
              <button
                type="button"
                className="transition-colors hover:text-neutral-500"
              >
                My Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
