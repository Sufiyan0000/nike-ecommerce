// src/components/SocialProviders.tsx
import React from "react";
import Image from "next/image";

type Variant = "sign-in" | "sign-up";

interface SocialProvidersProps {
  variant?: Variant;
}

const SocialProviders: React.FC<SocialProvidersProps> = ({
  variant = "sign-up",
}) => {
  const isSignIn = variant === "sign-in";

  const googleLabel = isSignIn ? "Sign in with Google" : "Continue with Google";
  const appleLabel = isSignIn ? "Sign in with Apple" : "Continue with Apple";

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-sm font-medium text-dark-900 transition hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
        aria-label={googleLabel}
      >
        <Image
          src="/google.svg"
          alt=""
          width={18}
          height={18}
          className="h-4 w-4"
        />
        <span>{googleLabel}</span>
      </button>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-sm font-medium text-dark-900 transition hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
        aria-label={appleLabel}
      >
        <Image
          src="/apple.svg"
          alt=""
          width={18}
          height={18}
          className="h-4 w-4"
        />
        <span>{appleLabel}</span>
      </button>
    </div>
  );
};

export default SocialProviders;
