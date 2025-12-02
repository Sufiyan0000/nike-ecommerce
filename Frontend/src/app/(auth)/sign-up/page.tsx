// src/app/(auth)/sign-up/page.tsx
import Link from "next/link";
import SocialProviders from "@/src/components/SocialProviders";
import AuthForm from "@/src/components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="space-y-5 ">
      {/* Top copy */}
      <div className="space-y-2 text-center">
        <p className="text-center text-footnote text-dark-700">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-dark-900 underline-offset-2 hover:underline"
          >
            Sign In
          </Link>
        </p>
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold font-jost leading-[30px] text-dark-900">
            Join Nike Today!
          </h1>
          <p className="text-caption text-dark-700">
            Create your account to start your fitness journey.
          </p>
        </div>
      </div>

      {/* Social providers */}
      <SocialProviders variant="sign-up" />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-light-300" />
        <span className="text-footnote text-dark-500">Or sign up with</span>
        <div className="h-px flex-1 bg-light-300" />
      </div>

      {/* Email/password form */}
      <AuthForm mode="sign-up" />
    </div>
  );
}
