// src/components/Card.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type BadgeTone = "default" | "success" | "accent";

export interface CardProps {
  title: string;
  subtitle?: string;          // e.g. "Men's Shoes"
  price?: string | number;    // e.g. "$98.30"
  meta?: string;              // e.g. "6 Colour"
  imageSrc: string;
  imageAlt: string;
  href?: string;
  badgeLabel?: string;        // e.g. "Best Seller", "Extra 20% off"
  badgeTone?: BadgeTone;
  className?: string;
}

const badgeToneClasses: Record<BadgeTone, string> = {
  default: "bg-light-100 text-neutral-900",
  success: "bg-emerald-50 text-emerald-700",
  accent: "bg-red-50 text-red-600",
};

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  price,
  meta,
  imageSrc,
  imageAlt,
  href,
  badgeLabel,
  badgeTone = "default",
  className,
}) => {
  const Wrapper = href ? Link : "article";
  const wrapperProps = href
    ? ({ href, className: clsx("block focus:outline-none", className) } as any)
    : ({ className: clsx("block", className) } as any);

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex h-full w-100 md:w-80 mx-auto flex-col overflow-hidden rounded-2xl bg-light-100 shadow-sm ring-1 ring-light-200 transition hover:-translate-y-1 hover:shadow-md ">
        <div className="relative ">
          <div className="relative aspect-4/4 w-full bg-light-300">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 380px, (min-width:1024px) 300px, (min-width:640px) 45vw,90vw"
              className="object-cover transition-transform duration-300 hover:scale-105 "
            />
          </div>

          {badgeLabel && (
            <div className="absolute left-4 top-4">
              <span
                className={clsx(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ",
                  badgeToneClasses[badgeTone]
                )}
              >
                {badgeLabel}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3 text-sm text-dark-900 sm:px-5 sm:pb-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-snug sm:text-lg">
              {title}
            </h3>
            {price !== undefined && (
              <span className="text-[16px] tracking-wider font-semibold text-dark-900">
                {typeof price === "number" ? `$${price.toFixed(2)}` : price}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-dark-700 sm:text-sm">{subtitle}</p>
          )}
          {meta && (
            <p className="mt-1 text-xs text-dark-500 sm:text-xs">{meta}</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Card;
