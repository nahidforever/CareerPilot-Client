"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface HeroSectionProps {
  totalJobs: number;
}

const recommendedJobs = [
  {
    title: "Frontend Developer",
    company: "Technology Company",
    type: "Remote",
  },
  {
    title: "UI/UX Designer",
    company: "Creative Agency",
    type: "Hybrid",
  },
  {
    title: "Data Analyst",
    company: "Business Solutions",
    type: "Full-time",
  },
];

const contentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

const contentItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const visualVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 42,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const jobListVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.55,
      staggerChildren: 0.12,
    },
  },
};

const jobItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 18,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HeroSection({ totalJobs }: HeroSectionProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      router.push("/jobs");
      return;
    }

    router.push(`/jobs?search=${encodeURIComponent(query)}`);
  };

  const initialState = shouldReduceMotion ? false : "hidden";
  const animateState = shouldReduceMotion ? undefined : "visible";

  return (
    <section className="relative flex min-h-[650px] overflow-hidden border-b border-white/10 bg-[#07111f] text-white lg:h-[72vh] lg:min-h-[650px] lg:max-h-[800px]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-36 top-0 h-[430px] w-[430px] rounded-full bg-blue-600/20 blur-[130px]"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 34, 0],
                  y: [0, 24, 0],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-32 bottom-[-40px] h-[430px] w-[430px] rounded-full bg-teal-400/10 blur-[130px]"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -28, 0],
                  y: [0, -22, 0],
                  scale: [1, 1.1, 1],
                }
          }
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_42%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.027)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.027)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_94%)]" />

        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0b1422] to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-12">
        {/* Hero content */}
        <motion.div
          className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          variants={contentVariants}
          initial={initialState}
          animate={animateState}
        >
          <motion.div variants={contentItemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.08)] backdrop-blur-sm sm:text-sm">
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: [0, 10, -6, 0],
                        scale: [1, 1.12, 1],
                      }
                }
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.span>
              Smart career opportunities in one place
            </div>
          </motion.div>

          <motion.h1
            variants={contentItemVariants}
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Find the right job.
            <span className="relative block bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Build your future.
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-1/2 h-px w-28 -translate-x-1/2 lg:left-0 lg:translate-x-0"
              >
                <motion.span
                  className="block h-full w-full bg-gradient-to-r from-transparent via-blue-400/70 to-transparent"
                  initial={
                    shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }
                  }
                  animate={
                    shouldReduceMotion ? undefined : { scaleX: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.75, delay: 0.78 }}
                />
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={contentItemVariants}
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base lg:mx-0 lg:text-lg lg:leading-8"
          >
            Explore meaningful opportunities, compare important job information
            and discover roles that match your skills, experience and career
            goals.
          </motion.p>

          {/* Interactive search */}
          <motion.form
            variants={contentItemVariants}
            onSubmit={handleSearch}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    borderColor: isSearchFocused
                      ? "rgba(96,165,250,0.42)"
                      : "rgba(255,255,255,0.10)",
                    boxShadow: isSearchFocused
                      ? "0 22px 65px rgba(0,0,0,0.30), 0 0 0 4px rgba(59,130,246,0.08)"
                      : "0 22px 65px rgba(0,0,0,0.22), 0 0 0 0 rgba(59,130,246,0)",
                  }
            }
            transition={{ duration: 0.22 }}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row lg:mx-0"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center">
                <motion.span
                  className="text-slate-500"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          color: isSearchFocused ? "#60a5fa" : "#64748b",
                          scale: isSearchFocused ? 1.06 : 1,
                        }
                  }
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-5 w-5" />
                </motion.span>
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search job title, company or skill..."
                aria-label="Search jobs"
                className="h-12 w-full rounded-xl border border-transparent bg-[#0d1929]/95 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/70 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -2,
                      scale: 1.015,
                    }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500"
            >
              Search jobs
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.form>

          {/* CTA buttons */}
          <motion.div
            variants={contentItemVariants}
            className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.012 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                href="/jobs"
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300 sm:w-auto"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Explore all jobs
              </Link>
            </motion.div>

            <motion.div
              className="w-full sm:w-auto"
              whileHover={
                shouldReduceMotion ? undefined : { x: 3, scale: 1.01 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                href="/jobs/add"
                className="group inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-semibold text-slate-400 transition hover:text-white sm:w-auto"
              >
                Post an opportunity
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={contentItemVariants}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 lg:justify-start"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400/80" />
              Public job browsing
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400/80" />
              Detailed opportunity data
            </span>
          </motion.div>
        </motion.div>

        {/* Animated visual */}
        <motion.div
          className="relative mx-auto hidden h-[480px] w-full max-w-[550px] lg:block"
          variants={visualVariants}
          initial={initialState}
          animate={animateState}
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              className="h-full w-full rounded-full border border-blue-400/10"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 360,
                      scale: [1, 1.025, 1],
                    }
              }
              transition={{
                rotate: {
                  duration: 32,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(96,165,250,0.85)]" />
            </motion.div>
          </div>

          <div className="absolute left-1/2 top-1/2 w-[430px] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#0e1a2b]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.012,
                      rotateX: 1.5,
                      rotateY: -1.5,
                    }
              }
              style={{ transformPerspective: 1000 }}
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-blue-400">
                    CareerPilot
                  </p>

                  <h2 className="mt-1 font-semibold text-white">
                    Recommended opportunities
                  </h2>
                </div>

                <motion.span
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          rotate: [0, 8, -6, 0],
                          scale: [1, 1.08, 1],
                        }
                  }
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.span>
              </div>

              <motion.div
                className="mt-5 space-y-3"
                variants={jobListVariants}
                initial={initialState}
                animate={animateState}
              >
                {recommendedJobs.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={jobItemVariants}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            x: 4,
                            scale: 1.012,
                            borderColor: "rgba(96,165,250,0.30)",
                            backgroundColor: "rgba(59,130,246,0.075)",
                          }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.company}
                      </p>
                    </div>

                    <span className="rounded-lg border border-teal-400/15 bg-teal-400/[0.07] px-2.5 py-1 text-[11px] font-medium text-teal-300">
                      {item.type}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.95 }}
              >
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">
                    {totalJobs}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                    Jobs
                  </p>
                </div>

                <div className="border-x border-white/10 text-center">
                  <p className="text-lg font-semibold text-white">8+</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                    Categories
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold text-white">3</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                    Work modes
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating cards */}
          <motion.div
            className="absolute left-0 top-14 rounded-2xl border border-white/10 bg-[#101d2e]/95 p-4 shadow-xl backdrop-blur-xl"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -28, y: 10 }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                    y: [0, -9, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.55, delay: 0.72 },
              x: { duration: 0.55, delay: 0.72 },
              y: {
                duration: 5.2,
                delay: 1.25,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
                <CheckCircle2 className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">Smart filtering</p>

                <p className="mt-0.5 text-sm font-semibold text-white">
                  Find better matches
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-0 rounded-2xl border border-white/10 bg-[#101d2e]/95 p-4 shadow-xl backdrop-blur-xl"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 28, y: 10 }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                    y: [0, 8, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.55, delay: 0.84 },
              x: { duration: 0.55, delay: 0.84 },
              y: {
                duration: 5.8,
                delay: 1.45,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <UsersRound className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">Public listings</p>

                <p className="mt-0.5 text-sm font-semibold text-white">
                  Explore freely
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-4 top-3 rounded-full border border-white/10 bg-white/[0.045] p-3 text-violet-300 shadow-xl backdrop-blur-xl"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.65 }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    scale: 1,
                    rotate: [0, 7, -4, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.45, delay: 0.9 },
              scale: {
                type: "spring",
                stiffness: 250,
                damping: 18,
                delay: 0.9,
              },
              rotate: {
                duration: 6,
                delay: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Building2 className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 lg:block">
        <motion.a
          href="#featured-jobs"
          aria-label="Go to featured jobs"
          className="flex flex-col items-center gap-1 text-xs text-slate-600 transition-colors hover:text-blue-300"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: [0, 5, 0],
                }
          }
          transition={{
            opacity: { duration: 0.5, delay: 1.1 },
            y: {
              duration: 2.2,
              delay: 1.3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          Explore below
          <ChevronDown className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
