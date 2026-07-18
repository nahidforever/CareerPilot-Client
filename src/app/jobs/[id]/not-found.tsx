import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, SearchX } from "lucide-react";

export default function JobNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#0b1422] px-4 py-12 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f1a2a] p-7 text-center shadow-2xl shadow-black/20 sm:p-10">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
          <SearchX className="h-9 w-9" />
        </span>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">
          Job not found
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          This opportunity is unavailable
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          The job may have been removed, the link may be incorrect, or the
          opportunity may no longer be available.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Explore jobs
          </Link>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
