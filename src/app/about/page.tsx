import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | CareerPilot",
  description:
    "Learn about CareerPilot, a modern platform for exploring career opportunities and managing job listings.",
};

const platformFeatures = [
  {
    title: "Smart job discovery",
    description:
      "Search opportunities by job title, company or skill and narrow results using category, location, salary and job type.",
    icon: Search,
  },
  {
    title: "Complete job information",
    description:
      "Review job descriptions, salary ranges, application deadlines, work arrangements and required skills.",
    icon: FileSearch,
  },
  {
    title: "Simple job management",
    description:
      "Authenticated employers can publish, update, review and remove their own job opportunities.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Secure protected actions",
    description:
      "Protected publishing and management features are restricted to authenticated users.",
    icon: ShieldCheck,
  },
];

const values = [
  {
    title: "Clarity",
    description:
      "Important job information should be easy to locate, understand and compare.",
    icon: Compass,
  },
  {
    title: "Accessibility",
    description:
      "Public opportunities should remain easy to explore across different devices.",
    icon: Users,
  },
  {
    title: "Efficiency",
    description:
      "Search, filtering and job management should require as few unnecessary steps as possible.",
    icon: Zap,
  },
  {
    title: "Relevance",
    description:
      "Candidates should be able to focus on opportunities aligned with their goals and preferences.",
    icon: Target,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08111f] px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_95%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            About CareerPilot
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Connecting people with
            <span className="block bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              meaningful opportunities
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:text-lg">
            CareerPilot is designed to make job discovery clearer, opportunity
            information easier to evaluate and published listings simpler to
            manage.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Explore jobs
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid w-full max-w-[1200px] gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-600/15 to-[#0f1a2a] p-6 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
              <Target className="h-5 w-5" />
            </span>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">
              Our mission
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Make career discovery simple and informative
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Our mission is to give candidates a clear way to discover
              opportunities while providing employers with a straightforward
              system for publishing and managing job information.
            </p>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-teal-400/15 bg-gradient-to-br from-teal-500/10 to-[#0f1a2a] p-6 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
              <Compass className="h-5 w-5" />
            </span>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-teal-400">
              Our vision
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              A more transparent opportunity marketplace
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              We envision a platform where candidates can confidently compare
              opportunities and employers can communicate role requirements
              through complete and well-organized listings.
            </p>
          </article>
        </div>
      </section>

      {/* Platform features */}
      <section className="border-y border-white/10 bg-[#091321] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mx-auto mb-11 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-xs font-medium text-violet-300 sm:text-sm">
              <BriefcaseBusiness className="h-4 w-4" />
              What we provide
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built around essential career needs
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              CareerPilot combines public job discovery with protected
              publishing tools in one consistent experience.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/25"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3.5 py-2 text-xs font-medium text-teal-300 sm:text-sm">
              <Zap className="h-4 w-4" />
              How CareerPilot works
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              A clear path from search to decision
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                description:
                  "Search public opportunities and use live filters to narrow the available listings.",
                icon: Search,
              },
              {
                number: "02",
                title: "Evaluate",
                description:
                  "Review the complete description, salary, location, deadline, work mode and required skills.",
                icon: FileSearch,
              },
              {
                number: "03",
                title: "Move forward",
                description:
                  "Choose opportunities that align with your experience, preferences and career direction.",
                icon: CheckCircle2,
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2a] p-6"
                >
                  <span className="absolute right-4 top-2 text-6xl font-bold text-white/[0.025]">
                    {step.number}
                  </span>

                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">
                    Step {step.number}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-white/10 bg-[#091321] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-300 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                Our core values
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Principles behind the platform
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                The CareerPilot experience is shaped by clarity, relevance,
                accessibility and efficient interaction.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    key={value.title}
                    className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                      <Icon className="h-5 w-5" />
                    </span>

                    <h3 className="mt-5 font-semibold">{value.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {value.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Designed for candidates and employers
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Different users receive a focused experience based on what they
              need from the platform.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-blue-400/15 bg-blue-500/[0.06] p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <Users className="h-5 w-5" />
              </span>

              <h3 className="mt-6 text-2xl font-semibold">For job seekers</h3>

              <div className="mt-5 space-y-3">
                {[
                  "Explore jobs without signing in",
                  "Use automatic search and filtering",
                  "Compare complete job information",
                  "Discover related opportunities",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-teal-400/15 bg-teal-500/[0.05] p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>

              <h3 className="mt-6 text-2xl font-semibold">For employers</h3>

              <div className="mt-5 space-y-3">
                {[
                  "Publish detailed job opportunities",
                  "Manage personal job listings",
                  "Update existing information",
                  "Remove unavailable opportunities",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-[#091321] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-[1050px] rounded-3xl border border-white/10 bg-[#0f1a2a] px-6 py-12 text-center shadow-2xl shadow-black/15 sm:px-10 lg:py-16">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <BriefcaseBusiness className="h-7 w-7" />
          </span>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore what CareerPilot can offer
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Discover available opportunities or publish a role for candidates to
            explore.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Explore jobs
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/jobs/add"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
            >
              Publish a job
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
