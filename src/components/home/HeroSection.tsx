"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

interface HeroSectionProps {
  totalJobs: number;
}

export default function HeroSection({ totalJobs }: HeroSectionProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      router.push("/jobs");
      return;
    }

    router.push(`/jobs?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative flex min-h-[620px] overflow-hidden border-b border-white/10 bg-[#08111f] text-white lg:h-[68vh] lg:min-h-[620px] lg:max-h-[760px]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
        {/* Hero content */}
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Smart career opportunities in one place
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Find the right job.
            <span className="block bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Build your future.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base lg:mx-0 lg:text-lg lg:leading-8">
            Explore meaningful opportunities, compare important job information
            and discover roles that match your skills, experience and career
            goals.
          </p>

          {/* Interactive search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row lg:mx-0"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search job title, company or skill..."
                aria-label="Search jobs"
                className="h-12 w-full rounded-xl border border-transparent bg-[#0d1929] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Search jobs
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* CTA buttons */}
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/jobs"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300 sm:w-auto"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Explore all jobs
            </Link>

            <Link
              href="/jobs/add"
              className="inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-semibold text-slate-400 transition hover:text-white sm:w-auto"
            >
              Post an opportunity
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Animated visual */}
        <div className="relative mx-auto hidden h-[460px] w-full max-w-[540px] lg:block">
          <div className="absolute left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[#0e1a2b]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-blue-400">
                  CareerPilot
                </p>

                <h2 className="mt-1 font-semibold text-white">
                  Recommended opportunities
                </h2>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  title: "Frontend Developer",
                  company: "Technology Company",
                  type: "Remote",
                },
                {
                  title: "UI/UX Designer",
                  company: "Creative Agency",
                  type: "Hybrid",
                },
                {
                  title: "Data Analyst",
                  company: "Business Solutions",
                  type: "Full-time",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5 transition hover:border-blue-400/20 hover:bg-blue-500/[0.06]"
                  style={{
                    animationDelay: `${index * 250}ms`,
                  }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {item.company}
                    </p>
                  </div>

                  <span className="rounded-lg border border-teal-400/15 bg-teal-400/[0.07] px-2.5 py-1 text-[11px] font-medium text-teal-300">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              <div className="text-center">
                <p className="text-lg font-semibold text-white">{totalJobs}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                  Jobs
                </p>
              </div>

              <div className="border-x border-white/10 text-center">
                <p className="text-lg font-semibold text-white">8+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                  Categories
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-white">3</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                  Work modes
                </p>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute left-0 top-16 animate-[bounce_5s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-[#101d2e]/95 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
                <CheckCircle2 className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">Smart filtering</p>

                <p className="mt-0.5 text-sm font-semibold text-white">
                  Find better matches
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 right-0 animate-[pulse_4s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-[#101d2e]/95 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <UsersRound className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">Public listings</p>

                <p className="mt-0.5 text-sm font-semibold text-white">
                  Explore freely
                </p>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/[0.045] p-3 text-violet-300 shadow-xl">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#featured-jobs"
        aria-label="Go to featured jobs"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-slate-600 transition hover:text-blue-300 lg:flex"
      >
        Explore below
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
