// src/components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cart.store";
import { ShoppingCart } from "lucide-react";
import loginImg from "../../public/add-user.png";
import loggedImg from "../../public/profile.webp";
import { signOut } from "../lib/api";
import { useRouter } from "next/navigation";

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
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=kids" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

const Navbar: React.FC<NavbarProps> = ({
  logoSrc = "/logo.svg", // put your Nike-style logo in /public/logo.svg
  navItems = defaultNavItems,
  cartCount = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { setUser } = useAuth();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setUser(null);
      clearCart();

      router.push("/sign-in");
    } catch (e: any) {
      console.log("Error during sign out:", e.message);
    }
  };

  // console.log("Cart in Navbar: ", cart);
  // console.log("Auth User:",user);

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
              src="/logo.svg"
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
            onClick={() => router.push('/cart')}
            type="button"
            className="relative transition-colors hover:text-neutral-500"
          >
            <ShoppingCart size={28} />

            {/* Badge */}
            {cart?.total_items > 0 ? (
              <span
                className="
        absolute -top-2 -right-2
        min-w-[18px] h-[18px]
        px-1
        flex items-center justify-center
        text-[11px] font-semibold
        bg-red-500 text-white
        rounded-full
      "
              >
                {cart?.total_items > 9 ? "9+" : cart?.total_items}

              </span>
            ) : null}
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-10 lg:hidden">
          {user ? (
            <Link
              href={"sign-up"}
              className="relative transition-colors hover:text-neutral-500"
            >
              <Image src={loggedImg} alt="" className="w-9" />
            </Link>
          ) : (
            <Link
              href={"sign-up"}
              className="relative transition-colors hover:text-neutral-500"
            >
              <Image src={loginImg} alt="" className="w-9" />
            </Link>
          )}

          <button
            onClick={() => router.push('/cart')}
            type="button"
            className="relative transition-colors hover:text-neutral-500"
          >
            <ShoppingCart size={30} />

            {/* Badge */}
            {cart?.total_items > 0 && (
              <span
                className="
        absolute -top-2 -right-2
        min-w-[18px] h-[18px]
        px-1
        flex items-center justify-center
        text-[11px] font-semibold
        bg-red-500 text-white
        rounded-full
      "
              >
                {cart?.total_items > 9 ? "9+" : cart?.total_items}
              </span>
            )}
          </button>

          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-full border border-neutral-300 p-2 hover:cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
          >
            <span className="relative flex h-6 w-6 flex-col justify-center items-center">
              {/* Top line */}
              <span
                className={`absolute h-[2px] w-5 bg-neutral-900 transition-all duration-300 ease-in-out
        ${isOpen ? "rotate-45" : "-translate-y-2"}
      `}
              />

              {/* Middle line */}
              <span
                className={`absolute h-[2px] w-5 bg-neutral-900 transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-0" : "opacity-100"}
      `}
              />

              {/* Bottom line */}
              <span
                className={`absolute h-[2px] w-5 bg-neutral-900 transition-all duration-300 ease-in-out
        ${isOpen ? "-rotate-45" : "translate-y-2"}
      `}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* AUTH */}
      <div className="absolute right-10 top-4 hidden lg:flex">
        {user ? (
          <div className="flex justify-center items-center gap-2 mr-[-5px]">
            <Link
              href={""}
              className="relative transition-colors font-medium text-md hover:text-neutral-500 flex justify-center items-center gap-2"
            >
              <Image src={loggedImg} alt="" className="w-9" />
              <span>{user.name}</span>
            </Link>
            <p className="font-medium text-md">|</p>
            <button
              onClick={handleLogout}
              className="
    rounded-lg
    transition underline
    text-md font-medium hover:cursor-pointer
    hover:scale-105
  "
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href={"sign-up"}
            className="relative flex justify-center items-center gap-2 transition-colors hover:text-neutral-500"
          >
            <Image src={loginImg} alt="" className="w-7" />
            <span>JOIN US</span>
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-md font-medium text-dark-900 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 transition-colors hover:text-dark-700"
                onClick={(prev) => setIsOpen(!prev)}
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
              <div>
                {user ? (
                  <button
                onClick={handleLogout}
                className="
    px-4 py-2 rounded-lg
    bg-neutral-100 text-neutral-900
    hover:scale-105
    transition
    text-md font-normal hover:cursor-pointer
    
  "
              >
                Logout
              </button>
                ):(
                  <Link href={'sign-in'}
                  className="px-4 py-2 rounded-lg
    bg-neutral-100 text-neutral-900
    hover:scale-105
    transition
    text-md font-normal hover:cursor-pointer" >
                    Login
                  </Link>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

export const DoodleUserIcon = () => (
  <svg width="80" height="80" viewBox="0 0 200 200" fill="none">
    <path
      d="M40 90 C30 40, 170 30, 160 100 C155 160, 60 170, 40 130 Z"
      fill="white"
    />
    <circle cx="90" cy="90" r="6" fill="black" />
    <circle cx="120" cy="90" r="6" fill="black" />
    <path
      d="M90 120 Q105 130 120 120"
      stroke="black"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
