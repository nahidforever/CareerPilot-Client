"use client";

import { useState, type FormEvent } from "react";
import { BriefcaseBusiness, LoaderCircle, Save, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { Job } from "@/types/job";

interface EditJobModalProps {
  job: Job;
  onClose: () => void;
  onUpdated: (job: Job) => void;
}

interface UpdateJobResponse {
  success?: boolean;
  message?: string;
  data?: Job;
}

const inputClassName =
  "h-11 w-full rounded-xl border border-white/10 bg-[#111d2d] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
  "w-full resize-none rounded-xl border border-white/10 bg-[#111d2d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName = "mb-2 block text-sm font-medium text-slate-300";

function formatDateForInput(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

export default function EditJobModal({
  job,
  onClose,
  onUpdated,
}: EditJobModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const salaryMin = Number(formData.get("salaryMin"));

    const salaryMax = Number(formData.get("salaryMax"));

    if (
      !Number.isFinite(salaryMin) ||
      !Number.isFinite(salaryMax) ||
      salaryMin < 0 ||
      salaryMax < 0
    ) {
      toast.error("Please provide valid salary values.");
      return;
    }

    if (salaryMin > salaryMax) {
      toast.error("Minimum salary cannot exceed maximum salary.");
      return;
    }

    const skills = String(formData.get("skills") || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      toast.error("Please provide at least one skill.");
      return;
    }

    const updateData = {
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

    setIsUpdating(true);

    try {
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Your session is invalid. Please log in again.");
        return;
      }

      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

      if (!serverUri) {
        toast.error("Server URL is not configured.");
        return;
      }

      const response = await fetch(`${serverUri}/manage/jobs/${job._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = (await response
        .json()
        .catch(() => null)) as UpdateJobResponse | null;

      if (!response.ok) {
        toast.error(result?.message || "Unable to update the job.");
        return;
      }

      if (!result?.data) {
        toast.error("The server did not return the updated job.");
        return;
      }

      onUpdated(result.data);

      toast.success(result.message || "Job updated successfully.");

      onClose();
    } catch {
      toast.error("Something went wrong while updating the job.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-job-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a2a] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>

            <div>
              <h2 id="edit-job-title" className="font-semibold text-white">
                Edit job
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Update your job listing information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close edit modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(92vh-145px)] overflow-y-auto px-5 py-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-title" className={labelClassName}>
                  Job title
                </label>

                <input
                  id="edit-title"
                  name="title"
                  defaultValue={job.title}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="edit-companyName" className={labelClassName}>
                  Company name
                </label>

                <input
                  id="edit-companyName"
                  name="companyName"
                  defaultValue={job.companyName}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="edit-companyLogo" className={labelClassName}>
                Company logo URL
              </label>

              <input
                id="edit-companyLogo"
                name="companyLogo"
                type="url"
                defaultValue={job.companyLogo || ""}
                disabled={isUpdating}
                className={inputClassName}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="edit-shortDescription" className={labelClassName}>
                Short description
              </label>

              <textarea
                id="edit-shortDescription"
                name="shortDescription"
                defaultValue={job.shortDescription}
                required
                maxLength={240}
                rows={3}
                disabled={isUpdating}
                className={textareaClassName}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="edit-fullDescription" className={labelClassName}>
                Full description
              </label>

              <textarea
                id="edit-fullDescription"
                name="fullDescription"
                defaultValue={job.fullDescription}
                required
                rows={6}
                disabled={isUpdating}
                className={textareaClassName}
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-category" className={labelClassName}>
                  Category
                </label>

                <select
                  id="edit-category"
                  name="category"
                  defaultValue={job.category}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                >
                  <option value="Software Development">
                    Software Development
                  </option>

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
                <label htmlFor="edit-jobType" className={labelClassName}>
                  Job type
                </label>

                <select
                  id="edit-jobType"
                  name="jobType"
                  defaultValue={job.jobType}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                >
                  <option value="Full-time">Full-time</option>

                  <option value="Part-time">Part-time</option>

                  <option value="Contract">Contract</option>

                  <option value="Internship">Internship</option>

                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-workMode" className={labelClassName}>
                  Work mode
                </label>

                <select
                  id="edit-workMode"
                  name="workMode"
                  defaultValue={job.workMode}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                >
                  <option value="On-site">On-site</option>

                  <option value="Remote">Remote</option>

                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-experienceLevel"
                  className={labelClassName}
                >
                  Experience level
                </label>

                <select
                  id="edit-experienceLevel"
                  name="experienceLevel"
                  defaultValue={job.experienceLevel}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                >
                  <option value="Entry Level">Entry Level</option>

                  <option value="Mid Level">Mid Level</option>

                  <option value="Senior Level">Senior Level</option>

                  <option value="Lead">Lead</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="edit-location" className={labelClassName}>
                Location
              </label>

              <input
                id="edit-location"
                name="location"
                defaultValue={job.location}
                required
                disabled={isUpdating}
                className={inputClassName}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="edit-skills" className={labelClassName}>
                Required skills
              </label>

              <input
                id="edit-skills"
                name="skills"
                defaultValue={job.skills.join(", ")}
                required
                disabled={isUpdating}
                className={inputClassName}
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate each skill using a comma.
              </p>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="edit-salaryMin" className={labelClassName}>
                  Minimum salary
                </label>

                <input
                  id="edit-salaryMin"
                  name="salaryMin"
                  type="number"
                  min={0}
                  defaultValue={job.salaryMin}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="edit-salaryMax" className={labelClassName}>
                  Maximum salary
                </label>

                <input
                  id="edit-salaryMax"
                  name="salaryMax"
                  type="number"
                  min={0}
                  defaultValue={job.salaryMax}
                  required
                  disabled={isUpdating}
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-applicationDeadline"
                  className={labelClassName}
                >
                  Deadline
                </label>

                <input
                  id="edit-applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  defaultValue={formatDateForInput(job.applicationDeadline)}
                  required
                  disabled={isUpdating}
                  className={`${inputClassName} scheme-dark`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
