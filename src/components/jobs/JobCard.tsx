import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  Eye,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

function formatSalary(value: number) {
  return new Intl.NumberFormat("en-BD").format(
    Number.isFinite(value) ? value : 0,
  );
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

export default function JobCard({ job }: JobCardProps) {
  const companyInitial = job.companyName?.charAt(0).toUpperCase() || "J";

  return (
    <article className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2a] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-950/20">
      {/* Image */}
      <div className="relative h-44 shrink-0 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#14233a] to-[#0c1727]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-blue-500/10 text-3xl font-bold text-blue-300">
            {companyInitial}
          </span>
        </div>

        {job.companyLogo && (
          <div
            role="img"
            aria-label={`${job.companyName} logo`}
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${job.companyLogo}")`,
            }}
          />
        )}

        <span className="absolute left-4 top-4 rounded-full border border-blue-400/20 bg-[#0b1422]/90 px-3 py-1.5 text-xs font-medium text-blue-300 backdrop-blur">
          {job.category}
        </span>

        <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-[#0b1422]/90 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
          {job.workMode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Company */}
        <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">
          {job.companyName}
        </p>

        {/* Title */}
        <h2 className="mt-2 line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-white">
          {job.title}
        </h2>

        {/* Short description */}
        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-400">
          {job.shortDescription}
        </p>

        {/* Meta information */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <Banknote className="h-4 w-4 shrink-0 text-emerald-400" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-600">
                Salary
              </p>

              <p className="truncate text-xs font-medium text-slate-300">
                ৳{formatSalary(job.salaryMin)} - ৳{formatSalary(job.salaryMax)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-blue-400" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-600">
                Deadline
              </p>

              <p className="truncate text-xs font-medium text-slate-300">
                {formatDate(job.applicationDeadline)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-violet-400" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-600">
                Experience
              </p>

              <p className="truncate text-xs font-medium text-slate-300">
                {job.experienceLevel}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-rose-400" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-600">
                Location
              </p>

              <p className="truncate text-xs font-medium text-slate-300">
                {job.location}
              </p>
            </div>
          </div>
        </div>

        {/* View details */}
        <div className="mt-auto pt-5">
          <Link
            href={`/jobs/${job._id}`}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-500"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="flex min-h-[480px] animate-pulse flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2a]">
      <div className="h-44 shrink-0 border-b border-white/10 bg-white/[0.05]" />

      <div className="flex flex-1 flex-col p-5">
        <div className="h-3 w-28 rounded bg-white/[0.06]" />

        <div className="mt-4 h-5 w-full rounded bg-white/[0.07]" />
        <div className="mt-2 h-5 w-3/4 rounded bg-white/[0.07]" />

        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded bg-white/[0.05]" />
          <div className="h-3 w-full rounded bg-white/[0.05]" />
          <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-14 rounded-xl bg-white/[0.05]" />
          ))}
        </div>

        <div className="mt-auto h-11 rounded-xl bg-white/[0.07]" />
      </div>
    </div>
  );
}
