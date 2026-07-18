"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const HIDDEN_ROUTES = ["/ai-assistant", "/login", "/register"];

export default function FloatingAIButton() {
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const isHiddenRoute = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Server এবং client-এর প্রথম render-এ null থাকবে
  if (!isMounted || isPending || !session?.user || isHiddenRoute) {
    return null;
  }

  return (
    <div className="group fixed bottom-5 right-4 z-[60] sm:bottom-7 sm:right-7">
      {/* Desktop tooltip */}
      <div className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-max translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
        <div className="rounded-xl border border-white/10 bg-[#111d2d] px-3.5 py-2.5 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />

            <p className="text-xs font-semibold text-white">
              Ask CareerPilot AI
            </p>
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            Career and job assistance
          </p>
        </div>

        <span className="absolute right-5 top-full h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-[#111d2d]" />
      </div>

      {/* Soft pulse */}
      <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/20 [animation-duration:2.5s]" />

      <Link
        href="/ai-assistant"
        aria-label="Open CareerPilot AI Assistant"
        title="Open CareerPilot AI Assistant"
        className="relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full border border-blue-300/20 bg-gradient-to-br from-blue-600 to-violet-600 px-4 text-white shadow-2xl shadow-blue-600/30 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/40 active:translate-y-0 sm:h-16 sm:w-16 sm:px-0"
      >
        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 transition group-hover:opacity-100" />

        <Bot className="relative h-5 w-5 sm:h-6 sm:w-6" />

        <span className="relative text-sm font-semibold sm:hidden">Ask AI</span>

        {/* Online indicator */}
        <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0b1422] bg-emerald-500 sm:right-1 sm:top-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </Link>
    </div>
  );
}
