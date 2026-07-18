"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa6";

const hiddenFooterRoutes = ["/login", "/register", "/forgot-password"];

const platformLinks = [
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
    label: "AI Assistant",
    href: "/ai-assistant",
  },
];

const companyLinks = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Sign in",
    href: "/login",
  },
  {
    label: "Create account",
    href: "/register",
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: FaLinkedinIn,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: FaGithub,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: FaFacebookF,
  },
];

export default function Footer() {
  const pathname = usePathname();

  const shouldHideFooter = hiddenFooterRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (shouldHideFooter) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#07101d] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link
              href="/"
              aria-label="CareerPilot home"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>

              <span className="text-left">
                <span className="block text-lg font-bold tracking-tight">
                  CareerPilot
                </span>

                <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  Intelligent careers
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
              A modern career platform for exploring job opportunities,
              reviewing complete role information and managing published
              listings.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-500 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform links */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="text-sm font-semibold text-white">Platform</h2>

            <nav
              aria-label="Footer platform navigation"
              className="mt-5 space-y-3"
            >
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-500 transition hover:text-blue-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company links */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="text-sm font-semibold text-white">Company</h2>

            <nav
              aria-label="Footer company navigation"
              className="mt-5 space-y-3"
            >
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-500 transition hover:text-blue-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact information */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="text-sm font-semibold text-white">
              Contact information
            </h2>

            <div className="mt-5 space-y-4">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Dhaka%2C+Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-center gap-3 text-sm text-slate-500 transition hover:text-blue-300 lg:justify-start"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  Dhaka, Bangladesh
                  <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
                </span>
              </a>

              <Link
                href="/contact"
                className="flex items-start justify-center gap-3 text-sm text-slate-500 transition hover:text-blue-300 lg:justify-start"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>Send us a message through the contact page</span>
              </Link>
            </div>

            <Link
              href="/contact"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
            >
              Contact CareerPilot
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6 text-center text-xs text-slate-600 sm:flex-row sm:justify-between sm:text-left">
          <p>© {currentYear} CareerPilot. All rights reserved.</p>

          <p>Built for intelligent career discovery.</p>
        </div>
      </div>
    </footer>
  );
}
