import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Eye,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Sparkles,
  Tags,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";
import DashboardCharts, {
  type JobStatusData,
  type MonthlyJobData,
} from "@/components/dashboard/DashboardCharts";
import type { Job } from "@/types/job";

export const dynamic = "force-dynamic";

interface JobsApiResponse {
  success: boolean;
  message: string;
  data: Job[];
}

interface StatCard {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
}

interface DashboardData {
  jobs: Job[];
  error: string | null;
}

function getInitials(name?: string | null) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getDateTime(date: string) {
  const parsedDate = new Date(date).getTime();

  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function isJobOpen(applicationDeadline: string) {
  const deadline = new Date(applicationDeadline);

  if (Number.isNaN(deadline.getTime())) {
    return false;
  }

  deadline.setHours(23, 59, 59, 999);

  return deadline.getTime() >= Date.now();
}

function createMonthlyJobData(jobs: Job[]): MonthlyJobData[] {
  const currentDate = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - (5 - index),
      1,
    );

    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(monthDate);

    const shortYear = String(monthDate.getFullYear()).slice(-2);

    const publishedJobs = jobs.filter((job) => {
      const createdDate = new Date(job.createdAt);

      if (Number.isNaN(createdDate.getTime())) {
        return false;
      }

      return (
        createdDate.getFullYear() === monthDate.getFullYear() &&
        createdDate.getMonth() === monthDate.getMonth()
      );
    }).length;

    return {
      month: `${monthName} '${shortYear}`,
      jobs: publishedJobs,
    };
  });
}

async function getDashboardData(): Promise<DashboardData> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    redirect("/login");
  }

  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    return {
      jobs: [],
      error: "NEXT_PUBLIC_SERVER_URI is not configured.",
    };
  }

  try {
    const response = await fetch(`${serverUri}/manage/jobs/my-jobs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenResponse.token}`,
      },
    });

    const result = (await response
      .json()
      .catch(() => null)) as JobsApiResponse | null;

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      return {
        jobs: [],
        error: result?.message || "Unable to load dashboard information.",
      };
    }

    return {
      jobs: Array.isArray(result?.data) ? result.data : [],
      error: null,
    };
  } catch (error) {
    return {
      jobs: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load dashboard information.",
    };
  }
}

export default async function DashboardPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const { jobs, error } = await getDashboardData();

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#0b1422] px-4 py-12 text-white">
        <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f1a2a] p-8 text-center shadow-2xl shadow-black/20">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
            <CircleAlert className="h-7 w-7" />
          </span>

          <h1 className="mt-5 text-xl font-semibold">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">{error}</p>

          <a
            href="/dashboard"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </a>
        </section>
      </main>
    );
  }

  const openJobs = jobs.filter((job) =>
    isJobOpen(job.applicationDeadline),
  ).length;

  const expiredJobs = jobs.length - openJobs;

  const categoryCount = new Set(
    jobs.map((job) => job.category?.trim()).filter(Boolean),
  ).size;

  const recentJobs = [...jobs]
    .sort(
      (firstJob, secondJob) =>
        getDateTime(secondJob.updatedAt) - getDateTime(firstJob.updatedAt),
    )
    .slice(0, 5);

  const monthlyData = createMonthlyJobData(jobs);

  const statusData: JobStatusData[] = [
    {
      name: "Open jobs",
      value: openJobs,
    },
    {
      name: "Expired jobs",
      value: expiredJobs,
    },
  ];

  const stats: StatCard[] = [
    {
      label: "Total jobs",
      value: jobs.length,
      description: "All opportunities you published",
      icon: BriefcaseBusiness,
      iconClassName: "text-blue-300",
      iconBackgroundClassName: "bg-blue-500/10",
    },
    {
      label: "Open jobs",
      value: openJobs,
      description: "Currently accepting applications",
      icon: CheckCircle2,
      iconClassName: "text-emerald-300",
      iconBackgroundClassName: "bg-emerald-500/10",
    },
    {
      label: "Expired jobs",
      value: expiredJobs,
      description: "Application deadlines have passed",
      icon: CircleX,
      iconClassName: "text-rose-300",
      iconBackgroundClassName: "bg-rose-500/10",
    },
    {
      label: "Categories",
      value: categoryCount,
      description: "Different career areas covered",
      icon: Tags,
      iconClassName: "text-violet-300",
      iconBackgroundClassName: "bg-violet-500/10",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Publish a job",
      description: "Create and publish a new opportunity.",
      href: "/jobs/add",
      icon: FilePlus2,
      iconClassName: "text-blue-300",
      iconBackgroundClassName: "bg-blue-500/10",
    },
    {
      title: "Manage jobs",
      description: "Edit or remove your published jobs.",
      href: "/jobs/manage",
      icon: FolderKanban,
      iconClassName: "text-amber-300",
      iconBackgroundClassName: "bg-amber-500/10",
    },
    {
      title: "Explore jobs",
      description: "Browse all public opportunities.",
      href: "/jobs",
      icon: BriefcaseBusiness,
      iconClassName: "text-emerald-300",
      iconBackgroundClassName: "bg-emerald-500/10",
    },
    {
      title: "AI Assistant",
      description: "Get intelligent career guidance.",
      href: "/ai-assistant",
      icon: WandSparkles,
      iconClassName: "text-violet-300",
      iconBackgroundClassName: "bg-violet-500/10",
    },
    {
      title: "My profile",
      description: "Review your account information.",
      href: "/profile",
      icon: UserRound,
      iconClassName: "text-sky-300",
      iconBackgroundClassName: "bg-sky-500/10",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Welcome section */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-600/15 via-[#0f1a2a] to-teal-500/[0.07] p-5 shadow-2xl shadow-black/15 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              {user.image ? (
                <span
                  role="img"
                  aria-label={`${user.name || "User"} profile`}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 bg-slate-800 bg-cover bg-center shadow-xl sm:h-20 sm:w-20"
                  style={{
                    backgroundImage: `url("${user.image}")`,
                  }}
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 text-xl font-bold text-white shadow-xl sm:h-20 sm:w-20 sm:text-2xl">
                  {getInitials(user.name)}
                </span>
              )}

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Personal dashboard
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                  Welcome back, {user.name || "CareerPilot User"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                  Review your job activity, monitor application deadlines and
                  manage your published opportunities.
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Signed in as {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs/manage"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
              >
                <FolderKanban className="h-4 w-4" />
                Manage jobs
              </Link>

              <Link
                href="/jobs/add"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                <FilePlus2 className="h-4 w-4" />
                Add new job
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 transition hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBackgroundClassName} ${stat.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <LayoutDashboard className="h-4 w-4 text-slate-800" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>

                <h2 className="mt-2 text-sm font-semibold text-slate-200">
                  {stat.label}
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </section>

        {/* Recharts client component */}
        <section className="mt-6">
          <DashboardCharts
            monthlyData={monthlyData}
            statusData={statusData}
            totalJobs={jobs.length}
          />
        </section>

        {/* Recent jobs and quick actions */}
        <section className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-xl shadow-black/10">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="flex items-center gap-2 text-blue-300">
                  <CalendarClock className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.13em]">
                    Recent activity
                  </p>
                </div>

                <h2 className="mt-2 text-lg font-semibold sm:text-xl">
                  Recently updated jobs
                </h2>
              </div>

              <Link
                href="/jobs/manage"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200"
              >
                Manage all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <BriefcaseBusiness className="h-7 w-7" />
                </span>

                <h3 className="mt-5 text-lg font-semibold">
                  No jobs published yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Publish your first opportunity to start generating dashboard
                  activity.
                </p>

                <Link
                  href="/jobs/add"
                  className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Publish your first job
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.07]">
                {recentJobs.map((job) => {
                  const jobIsOpen = isJobOpen(job.applicationDeadline);

                  return (
                    <article
                      key={job._id}
                      className="flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:px-6"
                    >
                      {job.companyLogo ? (
                        <span
                          role="img"
                          aria-label={`${job.companyName} logo`}
                          className="h-12 w-12 shrink-0 rounded-xl border border-white/10 bg-white bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url("${job.companyLogo}")`,
                          }}
                        />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-300">
                          {job.companyName?.charAt(0).toUpperCase() || "J"}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold">
                            {job.title}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                              jobIsOpen
                                ? "border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300"
                                : "border-red-400/15 bg-red-500/[0.07] text-red-300"
                            }`}
                          >
                            {jobIsOpen ? "Open" : "Expired"}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {job.companyName}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <BriefcaseBusiness className="h-3.5 w-3.5" />
                            {job.jobType}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Deadline: {formatDate(job.applicationDeadline)}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/jobs/${job._id}`}
                        title={`View ${job.title}`}
                        aria-label={`View ${job.title}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300 sm:px-3"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sm:hidden">View job</span>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <aside className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-xl shadow-black/10 xl:sticky xl:top-24">
            <div className="border-b border-white/10 px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-violet-300">
                Shortcuts
              </p>

              <h2 className="mt-2 text-lg font-semibold">Quick actions</h2>

              <p className="mt-1 text-sm text-slate-500">
                Access important CareerPilot features.
              </p>
            </div>

            <div className="space-y-2 p-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-white/[0.045]"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBackgroundClassName} ${action.iconClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-200 transition group-hover:text-white">
                        {action.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-600">
                        {action.description}
                      </span>
                    </span>

                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-700 transition group-hover:translate-x-1 group-hover:text-blue-300" />
                  </Link>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
