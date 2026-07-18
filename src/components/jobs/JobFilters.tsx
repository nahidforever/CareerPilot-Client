"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, RotateCcw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PublicJobFilters } from "@/types/job";

interface JobFiltersProps {
  currentFilters: PublicJobFilters;
}

const fieldClassName =
  "h-11 w-full rounded-xl border border-white/10 bg-[#111d2d] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500";

export default function JobFilters({ currentFilters }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentFilters.search);

  const [location, setLocation] = useState(currentFilters.location);

  const [minSalary, setMinSalary] = useState(currentFilters.minSalary);

  const [maxSalary, setMaxSalary] = useState(currentFilters.maxSalary);

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const paramsRef = useRef(new URLSearchParams(searchParams.toString()));

  const clearTimers = () => {
    Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));

    timersRef.current = {};
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const updateUrl = (name: string, value: string) => {
    const params = new URLSearchParams(paramsRef.current.toString());

    const normalizedValue = value.trim();

    if (normalizedValue) {
      params.set(name, normalizedValue);
    } else {
      params.delete(name);
    }

    // Filter change হলে আবার প্রথম page থেকে শুরু হবে
    params.delete("page");

    paramsRef.current = params;

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const updateUrlWithDebounce = (name: string, value: string, delay = 400) => {
    const existingTimer = timersRef.current[name];

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    timersRef.current[name] = setTimeout(() => {
      updateUrl(name, value);
    }, delay);
  };

  const handleReset = () => {
    clearTimers();

    setSearch("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");

    paramsRef.current = new URLSearchParams();

    startTransition(() => {
      router.replace(pathname, {
        scroll: false,
      });
    });
  };

  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-[#0f1a2a] p-4 shadow-xl shadow-black/10 sm:p-6">
      {/* Search */}
      <div>
        <label htmlFor="job-search" className={labelClassName}>
          Search jobs
        </label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

          <input
            id="job-search"
            name="search"
            type="search"
            value={search}
            placeholder="Search by title, company or skill..."
            onChange={(event) => {
              const value = event.target.value;

              setSearch(value);

              updateUrlWithDebounce("search", value);
            }}
            className={`${fieldClassName} pl-11 pr-24`}
          />

          {isPending && (
            <span className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-xs text-blue-300">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Updating
            </span>
          )}
        </div>
      </div>

      {/* Dropdown filters */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="job-category" className={labelClassName}>
            Category
          </label>

          <select
            id="job-category"
            name="category"
            defaultValue={currentFilters.category}
            onChange={(event) => updateUrl("category", event.target.value)}
            className={fieldClassName}
          >
            <option value="">All categories</option>

            <option value="Software Development">Software Development</option>

            <option value="Design">Design</option>

            <option value="Marketing">Marketing</option>

            <option value="Data Science">Data Science</option>

            <option value="Finance">Finance</option>

            <option value="Human Resources">Human Resources</option>

            <option value="Customer Support">Customer Support</option>

            <option value="Engineering">Engineering</option>
          </select>
        </div>

        <div>
          <label htmlFor="job-type" className={labelClassName}>
            Job type
          </label>

          <select
            id="job-type"
            name="jobType"
            defaultValue={currentFilters.jobType}
            onChange={(event) => updateUrl("jobType", event.target.value)}
            className={fieldClassName}
          >
            <option value="">All job types</option>

            <option value="Full-time">Full-time</option>

            <option value="Part-time">Part-time</option>

            <option value="Contract">Contract</option>

            <option value="Internship">Internship</option>

            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div>
          <label htmlFor="job-location" className={labelClassName}>
            Location
          </label>

          <input
            id="job-location"
            name="location"
            value={location}
            placeholder="Example: Dhaka"
            onChange={(event) => {
              const value = event.target.value;

              setLocation(value);

              updateUrlWithDebounce("location", value);
            }}
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="job-sort" className={labelClassName}>
            Sort by
          </label>

          <select
            id="job-sort"
            name="sort"
            defaultValue={currentFilters.sort}
            onChange={(event) => {
              const value = event.target.value;

              updateUrl("sort", value === "newest" ? "" : value);
            }}
            className={fieldClassName}
          >
            <option value="newest">Newest first</option>

            <option value="oldest">Oldest first</option>

            <option value="salary-low">Salary: low to high</option>

            <option value="salary-high">Salary: high to low</option>

            <option value="deadline">Deadline approaching</option>
          </select>
        </div>
      </div>

      {/* Salary filters */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="minimum-salary" className={labelClassName}>
            Minimum salary
          </label>

          <input
            id="minimum-salary"
            name="minSalary"
            type="number"
            min={0}
            value={minSalary}
            placeholder="Example: 30000"
            onChange={(event) => {
              const value = event.target.value;

              setMinSalary(value);

              updateUrlWithDebounce("minSalary", value);
            }}
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="maximum-salary" className={labelClassName}>
            Maximum salary
          </label>

          <input
            id="maximum-salary"
            name="maxSalary"
            type="number"
            min={0}
            value={maxSalary}
            placeholder="Example: 100000"
            onChange={(event) => {
              const value = event.target.value;

              setMaxSalary(value);

              updateUrlWithDebounce("maxSalary", value);
            }}
            className={fieldClassName}
          />
        </div>
      </div>

      {/* Reset */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-xs text-slate-500">
          {isPending
            ? "Updating job results..."
            : "Filters update results automatically."}
        </p>

        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </button>
      </div>
    </section>
  );
}
