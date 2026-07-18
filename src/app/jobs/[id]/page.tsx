import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Layers3,
  MapPin,
  MonitorSmartphone,
  Tag,
} from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import type { JobDetailsResponse } from "@/types/job";

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatSalary(value: number) {
  return new Intl.NumberFormat("en-BD").format(
    Number.isFinite(value) ? value : 0,
  );
}

function isDeadlinePassed(date: string) {
  const deadline = new Date(date);

  if (Number.isNaN(deadline.getTime())) {
    return false;
  }

  deadline.setHours(23, 59, 59, 999);

  return deadline.getTime() < Date.now();
}

async function getJobDetails(
  jobId: string,
): Promise<JobDetailsResponse | null> {
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    throw new Error("NEXT_PUBLIC_SERVER_URI is not configured.");
  }

  const response = await fetch(`${serverUri}/jobs/${jobId}`, {
    method: "GET",
  });

  const result = (await response.json().catch(() => null)) as
    | JobDetailsResponse
    | ApiErrorResponse
    | null;

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(result?.message || "Unable to retrieve job details.");
  }

  if (!result || !("data" in result) || !result.data?.job) {
    throw new Error("The server returned invalid job details.");
  }

  return result as JobDetailsResponse;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  const result = await getJobDetails(id);

  if (!result) {
    notFound();
  }

  const { job, relatedJobs } = result.data;

  const deadlinePassed = isDeadlinePassed(job.applicationDeadline);

  const companyInitial = job.companyName?.charAt(0).toUpperCase() || "J";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Back button */}
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        {/* Hero section */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-2xl shadow-black/15">
          {/* Media / image */}
          <div className="relative flex h-56 items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#172943] via-[#102039] to-[#091321] sm:h-64 lg:h-72">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />

              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
            </div>

            {job.companyLogo ? (
              <div
                role="img"
                aria-label={`${job.companyName} logo`}
                className="relative h-28 w-28 rounded-3xl border border-white/15 bg-white bg-contain bg-center bg-no-repeat shadow-2xl sm:h-36 sm:w-36"
                style={{
                  backgroundImage: `url("${job.companyLogo}")`,
                }}
              />
            ) : (
              <span className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/15 text-5xl font-bold text-blue-300 shadow-2xl sm:h-36 sm:w-36 sm:text-6xl">
                {companyInitial}
              </span>
            )}

            <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
              <span className="rounded-full border border-blue-400/20 bg-[#08111f]/85 px-3 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-md">
                {job.category}
              </span>

              <span className="rounded-full border border-white/10 bg-[#08111f]/85 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
                {job.workMode}
              </span>
            </div>

            <span
              className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md sm:right-6 sm:top-6 ${
                deadlinePassed
                  ? "border-red-400/20 bg-red-500/10 text-red-300"
                  : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />

              {deadlinePassed ? "Applications closed" : "Applications open"}
            </span>
          </div>

          {/* Hero content */}
          <div className="px-5 py-7 text-center sm:px-8 sm:py-9 lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-400">
              {job.companyName}
            </p>

            <h1 className="mx-auto mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {job.title}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              {job.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2">
                <MapPin className="h-4 w-4 text-rose-400" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2">
                <BriefcaseBusiness className="h-4 w-4 text-blue-400" />
                {job.jobType}
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2">
                <MonitorSmartphone className="h-4 w-4 text-teal-400" />
                {job.workMode}
              </span>
            </div>
          </div>
        </section>

        {/* Details content */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left content */}
          <div className="space-y-8">
            {/* Overview */}
            <section className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 sm:p-7 lg:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Layers3 className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">
                    Description
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    Job overview
                  </h2>
                </div>
              </div>

              <div className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {job.fullDescription}
              </div>
            </section>

            {/* Required skills */}
            <section className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 sm:p-7 lg:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Tag className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-400">
                    Qualifications
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    Required skills
                  </h2>
                </div>
              </div>

              {job.skills.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-3.5 py-2 text-sm font-medium text-violet-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-500">
                  No specific skills were provided.
                </p>
              )}
            </section>
          </div>

          {/* Key information */}
          <aside className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 sm:p-6 lg:sticky lg:top-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">
                Specifications
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Key information
              </h2>
            </div>

            <div className="mt-6 divide-y divide-white/[0.07]">
              <div className="flex items-start gap-3 py-4 first:pt-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Banknote className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Salary range</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    ৳{formatSalary(job.salaryMin)} - ৳
                    {formatSalary(job.salaryMax)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <CalendarDays className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Application deadline</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Experience level</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {job.experienceLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
                  <MonitorSmartphone className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Work arrangement</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {job.workMode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                  <Clock3 className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Job type</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {job.jobType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
                  <MapPin className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Location</p>

                  <p className="mt-1 break-words text-sm font-semibold text-white">
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4 last:pb-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                  <CalendarDays className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Published on</p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/jobs"
              className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
            >
              Explore more jobs
            </Link>
          </aside>
        </div>

        {/* Related jobs */}
        {relatedJobs.length > 0 && (
          <section className="mt-14 sm:mt-16">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">
                  Related opportunities
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Similar jobs you may like
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  More opportunities from the {job.category} category.
                </p>
              </div>

              <Link
                href={`/jobs?category=${encodeURIComponent(job.category)}`}
                className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
              >
                View all related jobs
              </Link>
            </div>

            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedJobs.map((relatedJob) => (
                <JobCard key={relatedJob._id} job={relatedJob} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
