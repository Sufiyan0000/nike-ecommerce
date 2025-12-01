// src/components/Footer.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '@/public/logo.svg'

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  logoSrc?: string;
  columns?: FooterColumn[];
  copyrightName?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    heading: "Featured",
    links: [
      { label: "Air Force 1", href: "#" },
      { label: "Huarache", href: "#" },
      { label: "Air Max 90", href: "#" },
      { label: "Air Max 95", href: "#" },
    ],
  },
  {
    heading: "Shoes",
    links: [
      { label: "All Shoes", href: "#" },
      { label: "Custom Shoes", href: "#" },
      { label: "Jordan Shoes", href: "#" },
      { label: "Running Shoes", href: "#" },
    ],
  },
  {
    heading: "Clothing",
    links: [
      { label: "All Clothing", href: "#" },
      { label: "Modest Wear", href: "#" },
      { label: "Hoodies & Pullovers", href: "#" },
      { label: "Shirts & Tops", href: "#" },
    ],
  },
  {
    heading: "Kids'",
    links: [
      { label: "Infant & Toddler Shoes", href: "#" },
      { label: "Kids' Shoes", href: "#" },
      { label: "Kids' Jordan Shoes", href: "#" },
      { label: "Kids' Basketball Shoes", href: "#" },
    ],
  },
];

const Footer: React.FC<FooterProps> = ({
  logoSrc = "@/public/logo.svg", // add a white logo to /public
  columns = defaultColumns,
  copyrightName = "Nike Inc.",
}) => {
  const year = new Date().getFullYear();

  const finalLogo = logoSrc ?? logo;

  return (
    <footer className="mt-16 bg-dark-900 text-sm text-light-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:py-12">
        {/* Left: logo */}
        <div className="flex items-start gap-4">
          <Image
            src={finalLogo}
            alt="Brand logo"
            width={56}
            height={56}
            className="h-8 w-auto sm:h-10 bg-dark-900 p-1 text-dark-900"
          />
        </div>

        {/* Middle: columns */}
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-100">
                {column.heading}
              </h3>
              <ul className="space-y-2 text-xs text-neutral-400">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-neutral-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right: social icons */}
        <div className="flex items-start justify-end gap-3">
          {/* add /x.svg, /facebook.svg, /instagram.svg in public/ */}
          <Link
            href="#"
            aria-label="X (Twitter)"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 transition hover:bg-neutral-700"
          >
            <Image src="/icons/x.svg" alt="" width={16} height={16} />
          </Link>
          <Link
            href="#"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 transition hover:bg-neutral-700"
          >
            <Image src="/icons/facebook.svg" alt="" width={16} height={16} />
          </Link>
          <Link
            href="#"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 transition hover:bg-neutral-700"
          >
            <Image src="/icons/instagram.svg" alt="" width={16} height={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {copyrightName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-neutral-300">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-neutral-300">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
