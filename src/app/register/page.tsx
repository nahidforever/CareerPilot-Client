"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  ImageIcon,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import AuthShowcase from "@/components/auth/auth-showcase";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.42l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.62A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.39 13.87A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.87V7.51H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.49l3.34-2.62Z"
      />

      <path
        fill="#EA4335"
        d="M12 6c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.51l3.34 2.62C7.18 7.76 9.39 6 12 6Z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const image = String(formData.get("image") || "").trim();
    const password = String(formData.get("password") || "");

    if (!name || !email || !password) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Please enter a valid full name.");
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Unable to create your account.");
        return;
      }

      toast.success("Account created successfully!");

      form.reset();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <main className="min-h-screen bg-[#0b1422] text-white lg:flex">
      <AuthShowcase />

      <section className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-[100px]" />

        <div className="relative z-10 w-full max-w-[470px]">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-3 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>

            <span className="text-lg font-bold">CareerPilot</span>
          </Link>

          {/* Heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Get started
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Join CareerPilot to publish jobs and discover better career
              opportunities.
            </p>
          </div>

          {/* Registration form */}
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isPending}
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isPending}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Profile image */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-slate-200"
                >
                  Profile image URL
                </label>

                <span className="text-xs text-slate-500">Optional</span>
              </div>

              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                <input
                  id="image"
                  name="image"
                  type="url"
                  autoComplete="url"
                  disabled={isPending}
                  placeholder="https://example.com/profile.jpg"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  disabled={isPending}
                  placeholder="Create at least 8 characters"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isPending}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0b1422] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Or continue with
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google button: UI only for now */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
