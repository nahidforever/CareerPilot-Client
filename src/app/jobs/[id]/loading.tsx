import { JobCardSkeleton } from "@/components/jobs/JobCard";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1400px] animate-pulse">
        <div className="mb-6 h-5 w-32 rounded bg-white/[0.05]" />

        {/* Hero skeleton */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a]">
          <div className="flex h-56 items-center justify-center border-b border-white/10 bg-white/[0.04] sm:h-64 lg:h-72">
            <div className="h-28 w-28 rounded-3xl bg-white/[0.07] sm:h-36 sm:w-36" />
          </div>

          <div className="flex flex-col items-center px-5 py-8">
            <div className="h-3 w-40 rounded bg-white/[0.05]" />

            <div className="mt-5 h-10 w-full max-w-2xl rounded-xl bg-white/[0.07]" />

            <div className="mt-3 h-10 w-3/4 max-w-xl rounded-xl bg-white/[0.07]" />

            <div className="mt-6 h-4 w-full max-w-3xl rounded bg-white/[0.05]" />

            <div className="mt-2 h-4 w-4/5 max-w-2xl rounded bg-white/[0.05]" />

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-10 w-32 rounded-xl bg-white/[0.05]"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Details skeleton */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-6">
              <div className="h-12 w-56 rounded-xl bg-white/[0.06]" />

              <div className="mt-7 space-y-3">
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-4 rounded bg-white/[0.045] ${
                      index === 7 ? "w-2/3" : "w-full"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-6">
              <div className="h-12 w-52 rounded-xl bg-white/[0.06]" />

              <div className="mt-7 flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-10 w-28 rounded-xl bg-white/[0.05]"
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-6">
            <div className="h-8 w-44 rounded bg-white/[0.06]" />

            <div className="mt-7 space-y-5">
              {Array.from({
                length: 7,
              }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.06]" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-white/[0.04]" />

                    <div className="h-4 w-36 rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 h-11 rounded-xl bg-white/[0.06]" />
          </aside>
        </div>

        {/* Related jobs skeleton */}
        <section className="mt-16">
          <div className="mb-7 h-9 w-72 rounded-xl bg-white/[0.06]" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
