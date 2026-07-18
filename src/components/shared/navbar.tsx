"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const publicRoutes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore Jobs",
    href: "/jobs",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const privateRoutes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore Jobs",
    href: "/jobs",
  },
  {
    label: "Add Job",
    href: "/jobs/add",
  },
  {
    label: "Manage Jobs",
    href: "/jobs/manage",
  },
  {
    label: "AI Assistant",
    href: "/ai-assistant",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const hiddenNavbarRoutes = ["/login", "/register", "/forgot-password"];

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const routes = user ? privateRoutes : publicRoutes;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const shouldHideNavbar = hiddenNavbarRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/jobs") {
      const isAddPage =
        pathname === "/jobs/add" || pathname.startsWith("/jobs/add/");

      const isManagePage =
        pathname === "/jobs/manage" || pathname.startsWith("/jobs/manage/");

      return (
        pathname === "/jobs" ||
        (pathname.startsWith("/jobs/") && !isAddPage && !isManagePage)
      );
    }

    if (href === "/jobs/add") {
      return pathname === "/jobs/add";
    }

    if (href === "/jobs/manage") {
      return (
        pathname === "/jobs/manage" || pathname.startsWith("/jobs/manage/")
      );
    }

    return pathname === href;
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to sign out.");
        return;
      }

      toast.success("Logged out successfully");

      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong while logging out.");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08111f]/95 text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10"
        >
          {/* Logo */}
          {/* Logo */}
          <Link
            href="/"
            aria-label="CareerPilot home"
            className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25 sm:h-10 sm:w-10">
              <BriefcaseBusiness className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-base font-bold tracking-tight sm:text-lg">
                CareerPilot
              </span>

              <span className="block truncate text-[8px] font-medium uppercase tracking-[0.11em] text-slate-500 min-[400px]:text-[9px] min-[400px]:tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]">
                Intelligent careers
              </span>
            </span>
          </Link>

          {/* Desktop routes */}
          <div className="hidden items-center gap-1 lg:flex">
            {routes.map((route) => {
              const active = isActiveRoute(route.href);

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-blue-500/10 text-blue-300"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {route.label}

                  {active && (
                    <span className="absolute inset-x-3 -bottom-[18px] h-0.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop authentication */}
          <div className="hidden items-center lg:flex">
            {isPending ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-28 animate-pulse rounded-xl bg-white/[0.06]" />
                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
              </div>
            ) : user ? (
              <div ref={profileMenuRef} className="relative">
                {/* Profile button */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] p-1.5 pr-3 transition hover:border-white/20 hover:bg-white/[0.075]"
                >
                  {user.image ? (
                    <span
                      role="img"
                      aria-label={`${user.name || "User"} profile`}
                      className="h-8 w-8 rounded-lg bg-slate-800 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${user.image}")`,
                      }}
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 text-xs font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  )}

                  <span className="max-w-28 truncate text-sm font-medium text-slate-200">
                    {user.name || "User"}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#101b2a] p-2 shadow-2xl shadow-black/40"
                  >
                    <div className="border-b border-white/10 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name || "CareerPilot User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <CircleUserRound className="h-4 w-4" />
                        My Profile
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-2">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <LogOut className="h-4 w-4" />

                        {isSigningOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="group flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300 hover:shadow-md hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] transition group-hover:bg-blue-500/15">
                    <LogIn className="h-3.5 w-3.5" />
                  </span>
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  <UserPlus className="h-4 w-4" />
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-300 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-[#08111f] text-white lg:hidden">
          <div className="flex h-full flex-col overflow-y-auto px-5 py-6 sm:px-8">
            {isPending ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-xl bg-white/[0.05]"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* User details */}
                {user && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    {user.image ? (
                      <span
                        role="img"
                        aria-label={`${user.name || "User"} profile`}
                        className="h-11 w-11 shrink-0 rounded-xl bg-slate-800 bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${user.image}")`,
                        }}
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 text-sm font-bold text-white">
                        {getInitials(user.name)}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name || "CareerPilot User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile main routes */}
                <div className="space-y-2">
                  {routes.map((route) => {
                    const active = isActiveRoute(route.href);

                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex min-h-12 items-center rounded-xl px-4 text-sm font-medium transition ${
                          active
                            ? "bg-blue-500/10 text-blue-300"
                            : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        {route.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile account routes */}
                {user && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Account
                    </p>

                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <CircleUserRound className="h-4 w-4" />
                        My Profile
                      </Link>
                    </div>
                  </div>
                )}

                {/* Mobile authentication actions */}
                <div className="mt-auto border-t border-white/10 pt-6">
                  {user ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />

                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign in
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500"
                      >
                        <UserPlus className="h-4 w-4" />
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
