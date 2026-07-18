import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarDays, CircleUserRound, Clock3, Mail } from "lucide-react";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | CareerPilot",
  description: "View and update your CareerPilot profile information.",
};

export const dynamic = "force-dynamic";

function getInitials(name?: string | null) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export default async function ProfilePage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-4 py-10 text-white sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-[1000px]">
        {/* Page heading */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <CircleUserRound className="h-4 w-4" />
            My profile
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile information
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Review and update your personal CareerPilot account information.
          </p>
        </section>

        {/* Profile overview */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-2xl shadow-black/15">
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-blue-600/15 via-[#0f1a2a] to-teal-500/[0.07] px-5 py-8 sm:px-8">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              {user.image ? (
                <span
                  role="img"
                  aria-label={`${user.name || "User"} profile`}
                  className="h-24 w-24 shrink-0 rounded-3xl border border-white/10 bg-slate-800 bg-cover bg-center shadow-2xl sm:h-28 sm:w-28"
                  style={{
                    backgroundImage: `url("${user.image}")`,
                  }}
                />
              ) : (
                <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-teal-400 text-3xl font-bold text-white shadow-2xl sm:h-28 sm:w-28">
                  {getInitials(user.name)}
                </span>
              )}

              <div className="min-w-0">
                <h2 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                  {user.name || "CareerPilot User"}
                </h2>

                <p className="mt-2 break-all text-sm text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="grid divide-y divide-white/[0.07] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-start gap-3 px-5 py-5 sm:px-7">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <Mail className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <p className="text-xs text-slate-600">Email address</p>

                <p className="mt-1 break-all text-sm font-medium text-slate-200">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 px-5 py-5 sm:px-7">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
                <CalendarDays className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs text-slate-600">Account created</p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-white/[0.07] px-5 py-5 sm:col-span-2 sm:px-7">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Clock3 className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs text-slate-600">Last profile update</p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Edit profile */}
        <section className="mt-6">
          <ProfileForm
            initialName={user.name || "CareerPilot User"}
            email={user.email}
            initialImage={user.image || null}
          />
        </section>
      </div>
    </main>
  );
}
