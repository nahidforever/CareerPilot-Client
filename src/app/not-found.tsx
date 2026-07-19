import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1422] px-5 py-12 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-600/10 blur-[110px]" />

      <div className="pointer-events-none absolute bottom-[-140px] right-[-100px] h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 w-full max-w-2xl text-center">
        {/* Logo */}
        <Link href="/" className="mx-auto inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>

          <span className="text-xl font-bold">CareerPilot</span>
        </Link>

        {/* Icon */}
        <div className="mx-auto mt-12 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-2xl shadow-blue-600/10">
          <SearchX className="h-9 w-9" />
        </div>

        {/* Error number */}
        <p className="mt-8 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl">
          404
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          The page you are looking for may have been removed, renamed, or is
          temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>

          <Link
            href="/jobs"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Explore jobs
          </Link>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to CareerPilot
        </Link>
      </section>
    </main>
  );
}
