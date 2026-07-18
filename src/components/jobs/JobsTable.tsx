"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  FilePlus2,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Job } from "@/types/job";
import EditJobModal from "@/components/jobs/edit-job-modal";
import DeleteJobDialog from "@/components/jobs/delete-job-dialog";

interface JobsTableProps {
  initialJobs: Job[];
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatSalary(value: number) {
  return new Intl.NumberFormat("en-BD").format(
    Number.isFinite(value) ? value : 0,
  );
}

export default function JobsTable({ initialJobs }: JobsTableProps) {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const [selectedEditJob, setSelectedEditJob] = useState<Job | null>(null);

  const [selectedDeleteJob, setSelectedDeleteJob] = useState<Job | null>(null);

  const handleUpdatedJob = (updatedJob: Job) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job)),
    );

    router.refresh();
  };

  const handleDeletedJob = (jobId: string) => {
    setJobs((currentJobs) => currentJobs.filter((job) => job._id !== jobId));

    router.refresh();
  };

  return (
    <>
      <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-10 text-white sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Heading section */}
          <section className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
              <BriefcaseBusiness className="h-4 w-4" />
              Job management
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Manage your jobs
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Review, update, view, or remove all the job opportunities you have
              published.
            </p>

            <Link
              href="/jobs/add"
              className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 sm:w-auto"
            >
              <FilePlus2 className="h-4 w-4" />
              Add new job
            </Link>
          </section>

          {/* Jobs table */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2a] shadow-xl shadow-black/10">
            {jobs.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center px-5 py-10 text-center sm:p-10">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <BriefcaseBusiness className="h-7 w-7" />
                </span>

                <h2 className="mt-5 text-lg font-semibold text-white sm:text-xl">
                  No jobs published yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Publish your first opportunity and it will appear here for
                  management.
                </p>

                <Link
                  href="/jobs/add"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Add your first job
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.025] text-left">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Job
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Type
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Location
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Salary
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Deadline
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="border-b border-white/[0.07] transition last:border-0 hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {job.companyLogo ? (
                              <span
                                role="img"
                                aria-label={`${job.companyName} logo`}
                                className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white bg-cover bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: `url("${job.companyLogo}")`,
                                }}
                              />
                            ) : (
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-300">
                                {job.companyName.charAt(0).toUpperCase()}
                              </span>
                            )}

                            <div className="min-w-0">
                              <p className="max-w-64 truncate text-sm font-semibold text-white">
                                {job.title}
                              </p>

                              <p className="mt-1 max-w-64 truncate text-xs text-slate-500">
                                {job.companyName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <span className="inline-flex rounded-lg border border-blue-400/15 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
                              {job.jobType}
                            </span>

                            <p className="mt-1.5 text-xs text-slate-500">
                              {job.workMode}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <MapPin className="h-4 w-4 shrink-0 text-slate-600" />

                            <span className="max-w-40 truncate">
                              {job.location}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          ৳{formatSalary(job.salaryMin)} - ৳
                          {formatSalary(job.salaryMax)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CalendarDays className="h-4 w-4 shrink-0 text-slate-600" />

                            {formatDate(job.applicationDeadline)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/jobs/${job._id}`}
                              title="View job"
                              aria-label={`View ${job.title}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              title="Edit job"
                              aria-label={`Edit ${job.title}`}
                              onClick={() => setSelectedEditJob(job)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-amber-400/30 hover:bg-amber-500/10 hover:text-amber-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              title="Delete job"
                              aria-label={`Delete ${job.title}`}
                              onClick={() => setSelectedDeleteJob(job)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedEditJob && (
        <EditJobModal
          job={selectedEditJob}
          onClose={() => setSelectedEditJob(null)}
          onUpdated={handleUpdatedJob}
        />
      )}

      {selectedDeleteJob && (
        <DeleteJobDialog
          job={selectedDeleteJob}
          onClose={() => setSelectedDeleteJob(null)}
          onDeleted={handleDeletedJob}
        />
      )}
    </>
  );
}
