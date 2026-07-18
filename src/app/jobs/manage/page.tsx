import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Job } from "@/types/job";
import JobsTable from "@/components/jobs/JobsTable";

interface MyJobsApiResponse {
  success?: boolean;
  message?: string;
  data?: Job[];
}

async function getMyJobs(): Promise<Job[]> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const tokenData = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenData?.token) {
    redirect("/login");
  }

  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    throw new Error("NEXT_PUBLIC_SERVER_URI is not configured.");
  }

  const response = await fetch(`${serverUri}/manage/jobs/my-jobs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
    cache: "no-store",
  });

  let result: MyJobsApiResponse;

  try {
    result = (await response.json()) as MyJobsApiResponse;
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      redirect("/login");
    }

    throw new Error(result.message || "Unable to retrieve your jobs.");
  }

  return Array.isArray(result.data) ? result.data : [];
}

export default async function ManageJobsPage() {
  const jobs = await getMyJobs();

  return <JobsTable initialJobs={jobs} />;
}
