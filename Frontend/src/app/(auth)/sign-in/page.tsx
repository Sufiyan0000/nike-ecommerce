// src/app/(auth)/sign-in/page.tsx
import Link from "next/link";
import SocialProviders from "@/src/components/SocialProviders";
import AuthForm from "@/src/components/AuthForm";

export default function SignInPage() {
  return (
    <div className="space-y-5">
      {/* Top copy */}
      <div className="space-y-2 text-center">
        <p className="text-center text-footnote text-dark-700">
          New to Nike?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-dark-900 underline-offset-2 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold leading-[30px] font-jost text-dark-900">
            Welcome Back
          </h1>
          <p className="text-caption text-dark-700">
            Sign in to access your account and continue your journey.
          </p>
        </div>
      </div>

      {/* Social providers */}
      <SocialProviders variant="sign-in" />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-light-300" />
        <span className="text-footnote text-dark-500">Or continue with</span>
        <div className="h-px flex-1 bg-light-300" />
      </div>

      {/* Email/password form */}
      <AuthForm mode="sign-in" />
    </div>
  );
}
