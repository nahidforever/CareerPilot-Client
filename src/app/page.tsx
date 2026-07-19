import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  FileSearch,
  Headphones,
  Lightbulb,
  MapPin,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  WalletCards,
  WandSparkles,
  Zap,
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import JobCard from "@/components/jobs/JobCard";
import type { Job, PublicJobsResponse } from "@/types/job";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HomeJobsData {
  jobs: Job[];
  totalJobs: number;
}

interface CategoryItem {
  name: string;
  description: string;
  icon: LucideIcon;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const categories: CategoryItem[] = [
  {
    name: "Software Development",
    description: "Frontend, backend and full-stack roles",
    icon: Code2,
  },
  {
    name: "Design",
    description: "UI, UX, visual and product design",
    icon: Palette,
  },
  {
    name: "Data Science",
    description: "Analytics, machine learning and data",
    icon: Database,
  },
  {
    name: "Marketing",
    description: "Digital, content and growth marketing",
    icon: Megaphone,
  },
  {
    name: "Finance",
    description: "Accounting, banking and finance",
    icon: WalletCards,
  },
  {
    name: "Customer Support",
    description: "Customer success and support roles",
    icon: Headphones,
  },
  {
    name: "Engineering",
    description: "Technical and engineering positions",
    icon: Building2,
  },
  {
    name: "Human Resources",
    description: "Recruitment and people operations",
    icon: UsersRound,
  },
];

const features: FeatureItem[] = [
  {
    title: "Powerful job discovery",
    description:
      "Search and filter opportunities by category, location, salary and job type.",
    icon: Search,
  },
  {
    title: "Complete job information",
    description:
      "Review salary, deadline, work mode, experience level and required skills.",
    icon: FileSearch,
  },
  {
    title: "Simple job management",
    description:
      "Employers can add, update, view and remove their published opportunities.",
    icon: BarChart3,
  },
  {
    title: "Secure authentication",
    description:
      "Protected employer actions are secured through Better Auth and JWT verification.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Do I need an account to explore jobs?",
    answer:
      "No. The Explore Jobs page and individual job details are publicly accessible. An account is only required for protected features such as publishing and managing jobs.",
  },
  {
    question: "How can I find a specific type of job?",
    answer:
      "Use the live search bar and filters on the Explore Jobs page. Results automatically update when you type or select category, job type, location, salary or sorting options.",
  },
  {
    question: "Can employers update a published job?",
    answer:
      "Yes. After signing in, employers can use the Manage Jobs page to edit or delete only the jobs they created.",
  },
  {
    question: "How do I check the application deadline?",
    answer:
      "Every job card and job details page displays the application deadline along with other key information.",
  },
  {
    question: "Does CareerPilot provide AI career support?",
    answer:
      "CareerPilot includes an AI Assistant area designed to support career exploration and job-related guidance.",
  },
];

async function getHomeJobs(): Promise<HomeJobsData> {
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    console.error("NEXT_PUBLIC_SERVER_URI is missing.");

    return {
      jobs: [],
      totalJobs: 0,
    };
  }

  const normalizedServerUri = serverUri.replace(/\/$/, "");

  try {
    const response = await fetch(
      `${normalizedServerUri}/jobs?sort=newest&page=1&limit=4`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const responseText = await response.text();

      console.error("Home jobs request failed:", response.status, responseText);

      return {
        jobs: [],
        totalJobs: 0,
      };
    }

    const result = (await response.json()) as PublicJobsResponse;

    return {
      jobs: Array.isArray(result.data) ? result.data : [],

      totalJobs: result.pagination?.totalItems ?? 0,
    };
  } catch (error) {
    console.error("Unable to load home page jobs:", error);

    return {
      jobs: [],
      totalJobs: 0,
    };
  }
}

export default async function HomePage() {
  const { jobs, totalJobs } = await getHomeJobs();

  return (
    <main className="bg-[#0b1422] text-white">
      {/* Section 1: Hero */}
      <HeroSection totalJobs={totalJobs} />

      {/* Section 2: Platform highlights */}
      <section className="border-b border-white/10 bg-[#0d1828]">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
          {[
            {
              value: totalJobs,
              label: "Published jobs",
              icon: BriefcaseBusiness,
            },
            {
              value: "8+",
              label: "Job categories",
              icon: Target,
            },
            {
              value: "5",
              label: "Job types",
              icon: BadgeCheck,
            },
            {
              value: "3",
              label: "Work arrangements",
              icon: MapPin,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center justify-center gap-3 bg-[#0d1828] px-4 py-7 sm:py-8"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Icon className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xl font-semibold text-white sm:text-2xl">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Featured jobs */}
      <section
        id="featured-jobs"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-9 flex flex-col gap-5 text-center sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                Latest opportunities
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Featured jobs
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Explore recently published opportunities from different
                industries and career categories.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
            >
              View all jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0f1a2a] p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                <BriefcaseBusiness className="h-7 w-7" />
              </span>

              <h3 className="mt-5 text-xl font-semibold">
                No jobs available yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                New opportunities will appear here after employers publish their
                job listings.
              </p>

              <Link
                href="/jobs/add"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Publish a job
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Categories */}
      <section className="border-y border-white/10 bg-[#091321] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-xs font-medium text-violet-300 sm:text-sm">
              <Target className="h-4 w-4" />
              Browse by career area
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Popular job categories
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Start with a category and discover roles aligned with your
              interests and professional strengths.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="group rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#111e30]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 transition group-hover:bg-blue-500/15">
                      <Icon className="h-5 w-5" />
                    </span>

                    <ArrowRight className="h-4 w-4 text-slate-700 transition group-hover:translate-x-1 group-hover:text-blue-300" />
                  </div>

                  <h3 className="mt-5 font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3.5 py-2 text-xs font-medium text-teal-300 sm:text-sm">
              <Zap className="h-4 w-4" />
              Simple career discovery
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Find opportunities in three steps
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              CareerPilot keeps the job discovery process simple, transparent
              and easy to navigate.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Search and filter",
                description:
                  "Search by job title, company or skill and narrow results using live filters.",
                icon: Search,
              },
              {
                step: "02",
                title: "Review complete details",
                description:
                  "Compare job overview, salary, location, deadline, work mode and required skills.",
                icon: FileSearch,
              },
              {
                step: "03",
                title: "Choose your opportunity",
                description:
                  "Identify the roles that match your experience, goals and preferred working style.",
                icon: CheckCircle2,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.step}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2a] p-6"
                >
                  <span className="absolute right-4 top-2 text-6xl font-bold text-white/[0.025]">
                    {item.step}
                  </span>

                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">
                    Step {item.step}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Features */}
      <section className="border-y border-white/10 bg-[#091321] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
              <ShieldCheck className="h-4 w-4" />
              Built for better decisions
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Why choose CareerPilot?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Every part of the platform is designed to make opportunity
              discovery and job management clearer and more efficient.
            </p>

            <Link
              href="/about"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Learn about CareerPilot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 transition hover:border-blue-400/25"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-5 font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 7: AI career support */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-600/15 via-[#0f1a2a] to-teal-500/10 p-6 shadow-2xl shadow-black/15 sm:p-9 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-xs font-medium text-violet-300 sm:text-sm">
                <WandSparkles className="h-4 w-4" />
                AI-powered guidance
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Get intelligent career support
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Use the CareerPilot AI Assistant to explore career-related
                questions and receive structured guidance during your job
                search.
              </p>

              <Link
                href="/ai-assistant"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
              >
                Open AI Assistant
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Explore career paths",
                  icon: Lightbulb,
                },
                {
                  title: "Understand job requirements",
                  icon: FileSearch,
                },
                {
                  title: "Identify useful skills",
                  icon: Target,
                },
                {
                  title: "Prepare career questions",
                  icon: Sparkles,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#091525]/70 p-4 backdrop-blur"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </span>

                    <p className="text-sm font-medium text-slate-200">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="border-y border-white/10 bg-[#091321] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-300 sm:text-sm">
              <Lightbulb className="h-4 w-4" />
              Common questions
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Find quick answers about exploring, publishing and managing
              opportunities.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-[#0f1a2a] open:border-blue-400/20"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
                  <span className="font-medium text-white">{faq.question}</span>

                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180 group-open:text-blue-300" />
                </summary>

                <div className="border-t border-white/[0.07] px-5 py-5 text-sm leading-7 text-slate-400 sm:px-6">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1100px] rounded-3xl border border-white/10 bg-[#0f1a2a] px-6 py-12 text-center shadow-2xl shadow-black/15 sm:px-10 lg:py-16">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <BriefcaseBusiness className="h-7 w-7" />
          </span>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to discover your next opportunity?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Explore available jobs or publish an opportunity and connect
            candidates with the right role.
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
              href="/jobs/add"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
            >
              Publish a job
              <BriefcaseBusiness className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
