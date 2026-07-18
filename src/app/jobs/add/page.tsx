"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  ImageIcon,
  Layers3,
  LoaderCircle,
  MapPin,
  MonitorSmartphone,
  Sparkles,
  Tag,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const inputClassName =
  "h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const inputWithIconClassName =
  "h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
  "w-full resize-none rounded-xl border border-white/10 bg-[#111d2d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName = "mb-2 block text-sm font-medium text-slate-200";

export default function AddJobPage() {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      router.replace("/login");
    }
  }, [isSessionPending, session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const salaryMin = Number(formData.get("salaryMin"));
    const salaryMax = Number(formData.get("salaryMax"));

    if (salaryMin > salaryMax) {
      toast.error("Minimum salary cannot exceed maximum salary.");
      return;
    }

    const skills = String(formData.get("skills") || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      toast.error("Please provide at least one required skill.");
      return;
    }

    const jobData = {
      title: String(formData.get("title") || "").trim(),
      companyName: String(formData.get("companyName") || "").trim(),
      companyLogo: String(formData.get("companyLogo") || "").trim(),
      shortDescription: String(formData.get("shortDescription") || "").trim(),
      fullDescription: String(formData.get("fullDescription") || "").trim(),
      category: String(formData.get("category") || ""),
      jobType: String(formData.get("jobType") || ""),
      workMode: String(formData.get("workMode") || ""),
      location: String(formData.get("location") || "").trim(),
      experienceLevel: String(formData.get("experienceLevel") || ""),
      salaryMin,
      salaryMax,
      applicationDeadline: String(formData.get("applicationDeadline") || ""),
      skills,
    };

    setIsSubmitting(true);

    try {
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Your session is invalid. Please sign in again.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/manage/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(jobData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Unable to publish the job.");
        return;
      }

      toast.success("Job published successfully!");

      form.reset();
      router.push("/jobs/manage");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSessionPending) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#0b1422]">
        <div className="flex items-center gap-3 text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin text-blue-400" />
          Checking authentication...
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto w-full max-w-6xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Heading */}
        <section className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <BriefcaseBusiness className="h-4 w-4" />
            Publish an opportunity
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Add a new job
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Provide complete and accurate information to help candidates
            understand the role and evaluate the opportunity.
          </p>

          <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-400/15 bg-teal-400/[0.07] px-4 py-3 text-sm text-teal-300 sm:w-auto">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Your listing will be publicly visible</span>
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main form */}
            <div className="space-y-6">
              {/* Basic information */}
              <section className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white">
                    Basic information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add the primary details candidates will see first.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="title" className={labelClassName}>
                      Job title
                    </label>

                    <div className="relative">
                      <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="Senior Frontend Developer"
                        className={inputWithIconClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyName" className={labelClassName}>
                      Company name
                    </label>

                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="Company name"
                        className={inputWithIconClassName}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="companyLogo"
                      className="text-sm font-medium text-slate-200"
                    >
                      Company logo URL
                    </label>

                    <span className="text-xs text-slate-500">Optional</span>
                  </div>

                  <div className="relative">
                    <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                    <input
                      id="companyLogo"
                      name="companyLogo"
                      type="url"
                      disabled={isSubmitting}
                      placeholder="https://example.com/company-logo.png"
                      className={inputWithIconClassName}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="shortDescription" className={labelClassName}>
                    Short description
                  </label>

                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    required
                    maxLength={240}
                    rows={3}
                    disabled={isSubmitting}
                    placeholder="Write a concise overview of the position."
                    className={textareaClassName}
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="fullDescription" className={labelClassName}>
                    Full description
                  </label>

                  <textarea
                    id="fullDescription"
                    name="fullDescription"
                    required
                    minLength={50}
                    rows={8}
                    disabled={isSubmitting}
                    placeholder="Describe responsibilities, requirements, benefits, and what candidates can expect from the role."
                    className={textareaClassName}
                  />
                </div>
              </section>

              {/* Job specifications */}
              <section className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white">
                    Job specifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Define the employment type, location, and experience.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className={labelClassName}>
                      Category
                    </label>

                    <div className="relative">
                      <Layers3 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <select
                        id="category"
                        name="category"
                        required
                        defaultValue=""
                        disabled={isSubmitting}
                        className={inputWithIconClassName}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        <option value="Software Development">
                          Software Development
                        </option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Finance">Finance</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Customer Support">
                          Customer Support
                        </option>
                        <option value="Engineering">Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="jobType" className={labelClassName}>
                      Job type
                    </label>

                    <select
                      id="jobType"
                      name="jobType"
                      required
                      defaultValue=""
                      disabled={isSubmitting}
                      className={inputClassName}
                    >
                      <option value="" disabled>
                        Select job type
                      </option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="workMode" className={labelClassName}>
                      Work mode
                    </label>

                    <div className="relative">
                      <MonitorSmartphone className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <select
                        id="workMode"
                        name="workMode"
                        required
                        defaultValue=""
                        disabled={isSubmitting}
                        className={inputWithIconClassName}
                      >
                        <option value="" disabled>
                          Select work mode
                        </option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className={labelClassName}>
                      Experience level
                    </label>

                    <div className="relative">
                      <UsersRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <select
                        id="experienceLevel"
                        name="experienceLevel"
                        required
                        defaultValue=""
                        disabled={isSubmitting}
                        className={inputWithIconClassName}
                      >
                        <option value="" disabled>
                          Select experience
                        </option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Lead">Lead</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="location" className={labelClassName}>
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      disabled={isSubmitting}
                      placeholder="Dhaka, Bangladesh"
                      className={inputWithIconClassName}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="skills" className={labelClassName}>
                    Required skills
                  </label>

                  <div className="relative">
                    <Tag className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      required
                      disabled={isSubmitting}
                      placeholder="React, Next.js, TypeScript, REST API"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Separate multiple skills using commas.
                  </p>
                </div>
              </section>

              {/* Compensation */}
              <section className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 shadow-xl shadow-black/10 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white">
                    Compensation and deadline
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the monthly salary range and application deadline.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="salaryMin" className={labelClassName}>
                      Minimum salary
                    </label>

                    <div className="relative">
                      <Banknote className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <input
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        min={0}
                        required
                        disabled={isSubmitting}
                        placeholder="40000"
                        className={inputWithIconClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="salaryMax" className={labelClassName}>
                      Maximum salary
                    </label>

                    <div className="relative">
                      <Banknote className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <input
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        min={0}
                        required
                        disabled={isSubmitting}
                        placeholder="70000"
                        className={inputWithIconClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="applicationDeadline"
                      className={labelClassName}
                    >
                      Application deadline
                    </label>

                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />

                      <input
                        id="applicationDeadline"
                        name="applicationDeadline"
                        type="date"
                        required
                        disabled={isSubmitting}
                        className={`${inputWithIconClassName} scheme-dark`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5 lg:sticky lg:top-24">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <FileText className="h-5 w-5" />
                </div>

                <h2 className="mt-5 font-semibold text-white">
                  Ready to publish?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review the information carefully before making the listing
                  publicly available.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish job
                      <BriefcaseBusiness className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />

                    <p className="text-xs leading-5 text-slate-500">
                      AI job-description assistance will be integrated into this
                      form in a later phase.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
