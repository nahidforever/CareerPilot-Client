import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover better opportunities",
    description:
      "Search relevant roles using skill, location, salary, and work preferences.",
  },
  {
    icon: Sparkles,
    title: "Publish jobs with AI",
    description:
      "Turn a few structured details into a polished, professional job post.",
  },
  {
    icon: Bot,
    title: "Get contextual career guidance",
    description:
      "Chat with an AI assistant that understands your goals and job preferences.",
  },
];

export default function AuthShowcase() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 bg-[#08111f] lg:flex lg:w-[52%] lg:flex-col lg:justify-between">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 px-10 py-9 xl:px-16 xl:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-white transition-opacity hover:opacity-80"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>

          <span>
            <span className="block text-xl font-bold tracking-tight">
              CareerPilot
            </span>
            <span className="block text-xs font-medium text-slate-400">
              AI-powered job discovery
            </span>
          </span>
        </Link>
      </div>

      <div className="relative z-10 max-w-2xl px-10 xl:px-16">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-sm font-medium text-blue-300">
          <Sparkles className="h-4 w-4" />
          Build your career with intelligent tools
        </div>

        <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-white xl:text-5xl">
          Find work that moves your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
            career forward.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 xl:text-lg">
          Discover meaningful opportunities, publish professional job listings,
          and make confident career decisions with AI-powered assistance.
        </p>

        <div className="mt-10 space-y-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-blue-300">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-100">
                    {feature.title}
                  </h2>
                  <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 px-10 py-9 xl:px-16 xl:py-12">
        <div className="flex max-w-xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
              <CheckCircle2 className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-medium text-white">
                One platform, smarter career decisions
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Explore, publish, save, and get AI guidance
              </p>
            </div>
          </div>

          <ArrowUpRight className="h-5 w-5 text-slate-500" />
        </div>
      </div>
    </section>
  );
}
