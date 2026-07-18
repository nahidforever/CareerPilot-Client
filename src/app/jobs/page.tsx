import { Suspense } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  SearchX,
} from "lucide-react";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard, { JobCardSkeleton } from "@/components/jobs/JobCard";
import type {
  JobSortOption,
  PublicJobFilters,
  PublicJobsResponse,
} from "@/types/job";

type JobsPageSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

interface JobsPageProps {
  searchParams: JobsPageSearchParams;
}

const validSortOptions: JobSortOption[] = [
  "newest",
  "oldest",
  "salary-low",
  "salary-high",

  "deadline",
];

function getQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getSortOption(value: string): JobSortOption {
  return validSortOptions.includes(value as JobSortOption)
    ? (value as JobSortOption)
    : "newest";
}

function createApiQuery(filters: PublicJobFilters) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.jobType) {
    params.set("jobType", filters.jobType);
  }

  if (filters.minSalary) {
    params.set("minSalary", filters.minSalary);
  }

  if (filters.maxSalary) {
    params.set("maxSalary", filters.maxSalary);
  }

  params.set("sort", filters.sort);
  params.set("page", String(filters.page));
  params.set("limit", "8");

  return params;
}

function createPageHref(filters: PublicJobFilters, page: number) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.jobType) {
    params.set("jobType", filters.jobType);
  }

  if (filters.minSalary) {
    params.set("minSalary", filters.minSalary);
  }

  if (filters.maxSalary) {
    params.set("maxSalary", filters.maxSalary);
  }

  if (filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `/jobs?${queryString}` : "/jobs";
}

async function getJobs(filters: PublicJobFilters): Promise<PublicJobsResponse> {
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    throw new Error("NEXT_PUBLIC_SERVER_URI is not configured.");
  }

  const query = createApiQuery(filters);

  const response = await fetch(`${serverUri}/jobs?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const result = (await response.json()) as PublicJobsResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to retrieve jobs.");
  }

  return result;
}

function JobsGridLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}

async function JobsResults({ filters }: { filters: PublicJobFilters }) {
  const result = await getJobs(filters);

  if (result.data.length === 0) {
    return (
      <section className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0f1a2a] px-5 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
          <SearchX className="h-7 w-7" />
        </span>

        <h2 className="mt-5 text-xl font-semibold text-white">
          No matching jobs found
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Try changing your search, category, location, salary range or other
          filters.
        </p>

        <Link
          href="/jobs"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Clear all filters
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-white">{result.data.length}</span>{" "}
          jobs from{" "}
          <span className="font-semibold text-white">
            {result.pagination.totalItems}
          </span>{" "}
          results
        </p>

        <p className="text-sm text-slate-500">
          Page {result.pagination.currentPage} of {result.pagination.totalPages}
        </p>
      </div>

      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {result.data.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {result.pagination.totalPages > 1 && (
        <nav
          aria-label="Jobs pagination"
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {result.pagination.hasPreviousPage ? (
            <Link
              href={createPageHref(filters, result.pagination.currentPage - 1)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0f1a2a] px-5 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:text-blue-300 sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-5 text-sm font-semibold text-slate-700 sm:w-auto">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </span>
          )}

          <span className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300">
            {result.pagination.currentPage} / {result.pagination.totalPages}
          </span>

          {result.pagination.hasNextPage ? (
            <Link
              href={createPageHref(filters, result.pagination.currentPage + 1)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0f1a2a] px-5 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:text-blue-300 sm:w-auto"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-5 text-sm font-semibold text-slate-700 sm:w-auto">
              Next
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </>
  );
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;

  const requestedPage = Number(getQueryValue(resolvedSearchParams.page));

  const filters: PublicJobFilters = {
    search: getQueryValue(resolvedSearchParams.search).trim(),

    category: getQueryValue(resolvedSearchParams.category).trim(),

    location: getQueryValue(resolvedSearchParams.location).trim(),

    jobType: getQueryValue(resolvedSearchParams.jobType).trim(),

    minSalary: getQueryValue(resolvedSearchParams.minSalary).trim(),

    maxSalary: getQueryValue(resolvedSearchParams.maxSalary).trim(),

    sort: getSortOption(getQueryValue(resolvedSearchParams.sort)),

    page:
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };

  const suspenseKey = JSON.stringify(filters);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-10 text-white sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Heading */}
        <section className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <BriefcaseBusiness className="h-4 w-4" />
            Explore opportunities
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Find your next opportunity
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Discover jobs that match your skills, preferred location, experience
            and career goals.
          </p>
        </section>

        <JobFilters key={`filters-${suspenseKey}`} currentFilters={filters} />

        <Suspense key={`results-${suspenseKey}`} fallback={<JobsGridLoading />}>
          <JobsResults filters={filters} />
        </Suspense>
      </div>
    </main>
  );
}
