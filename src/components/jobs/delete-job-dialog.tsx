"use client";

import { useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { Job } from "@/types/job";

interface DeleteJobDialogProps {
  job: Job;
  onClose: () => void;
  onDeleted: (jobId: string) => void;
}

interface DeleteJobResponse {
  success?: boolean;
  message?: string;
}

export default function DeleteJobDialog({
  job,
  onClose,
  onDeleted,
}: DeleteJobDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

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
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = (await response
        .json()
        .catch(() => null)) as DeleteJobResponse | null;

      if (!response.ok) {
        toast.error(result?.message || "Unable to delete the job.");
        return;
      }

      onDeleted(job._id);

      toast.success(result?.message || "Job deleted successfully.");

      onClose();
    } catch {
      toast.error("Something went wrong while deleting the job.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-job-title"
      aria-describedby="delete-job-description"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1a2a] p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </span>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close delete dialog"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2
          id="delete-job-title"
          className="mt-5 text-xl font-semibold text-white"
        >
          Delete this job?
        </h2>

        <p
          id="delete-job-description"
          className="mt-3 text-sm leading-6 text-slate-400"
        >
          You are about to permanently delete{" "}
          <span className="font-semibold text-slate-200">{job.title}</span> at{" "}
          <span className="font-semibold text-slate-200">
            {job.companyName}
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
