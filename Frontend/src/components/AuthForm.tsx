// src/components/AuthForm.tsx
"use client";

import React, { useState } from "react";

type Mode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode?: Mode;
  onSubmit: ( data: {
    username?: string;
    email: string;
    password: string;
  }) => void | Promise<void>;
}

const baseInputClasses =
  "w-full rounded-xl border border-light-300 bg-light-100 px-3 py-2.5 text-sm text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2";

const AuthForm: React.FC<AuthFormProps> = ({ mode = "sign-up",onSubmit }) => {
  const isSignIn = mode === "sign-in";
  const buttonLabel = isSignIn ? "Sign In" : "Sign Up";

  const [username,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        // auth logic will be wired later
        onSubmit({ username, email , password});

      }}
    >
      {/* Name (sign up only) */}
      {!isSignIn && (
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-xs font-medium text-dark-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className={baseInputClasses}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-medium text-dark-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="johndoe@gmail.com"
          className={baseInputClasses}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium text-dark-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder={
            isSignIn ? "Enter your password" : "minimum 8 characters"
          }
          className={baseInputClasses}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isSignIn ? "current-password" : "new-password"}
          required
        />
      </div>

      {/* Remember / Forgot (sign in only) */}
      {isSignIn && (
        <div className="flex items-center justify-between text-xs text-dark-700">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-light-300 text-dark-900 focus:ring-dark-900"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="font-medium text-dark-900 underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full mt-4 bg-dark-900 px-4 py-3 text-sm font-semibold text-light-100 transition hover:bg-black/80 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
      >
        {buttonLabel}
      </button>

      {/* Terms (sign up only) */}
      {!isSignIn && (
        <p className="text-center text-footnote text-dark-700">
          By signing up, you agree to our{" "}
          <button
            type="button"
            className="font-medium underline underline-offset-2"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="font-medium underline underline-offset-2"
          >
            Privacy Policy
          </button>
          .
        </p>
      )}
    </form>
  );
};

export default AuthForm;
