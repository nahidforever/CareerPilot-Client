import { JobCardSkeleton } from "@/components/jobs/JobCard";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-10 text-white sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Heading skeleton */}
        <section className="mx-auto mb-10 flex max-w-3xl animate-pulse flex-col items-center">
          <div className="h-9 w-44 rounded-full bg-white/[0.06]" />

          <div className="mt-5 h-10 w-full max-w-xl rounded-xl bg-white/[0.07]" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.05]" />

          <div className="mt-2 h-4 w-4/5 max-w-xl rounded bg-white/[0.05]" />
        </section>

        {/* Filter skeleton */}
        <div className="mb-8 animate-pulse rounded-2xl border border-white/10 bg-[#0f1a2a] p-4 sm:p-6">
          <div className="h-11 w-full rounded-xl bg-white/[0.05]" />

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-11 rounded-xl bg-white/[0.05]" />
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="h-11 rounded-xl bg-white/[0.05]" />
            ))}
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
