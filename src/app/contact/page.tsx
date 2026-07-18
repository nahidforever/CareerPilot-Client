import type { Metadata } from "next";
import {
  BriefcaseBusiness,
  CircleHelp,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | CareerPilot",
  description:
    "Contact CareerPilot for general questions, job listing support, technical assistance or feedback.",
};

const supportAreas = [
  {
    title: "General inquiries",
    description:
      "Ask questions about CareerPilot, its features or available platform services.",
    icon: CircleHelp,
  },
  {
    title: "Job listing support",
    description:
      "Get assistance related to publishing, updating or managing a job opportunity.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Technical assistance",
    description:
      "Report a technical issue encountered while navigating or using the platform.",
    icon: Wrench,
  },
  {
    title: "Feedback",
    description:
      "Share suggestions that may help improve the CareerPilot experience.",
    icon: MessageCircle,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08111f] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Contact CareerPilot
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            How can we help?
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Send us your questions, technical concerns, feedback or requests
            related to a published opportunity.
          </p>
        </div>
      </section>

      {/* Support areas */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article
                  key={area.title}
                  className="rounded-2xl border border-white/10 bg-[#0f1a2a] p-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h2 className="mt-5 font-semibold">{area.title}</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {area.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto grid w-full max-w-[1200px] items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Contact information */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-white/10 bg-[#0f1a2a] p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
                <MessageCircle className="h-5 w-5" />
              </span>

              <h2 className="mt-6 text-xl font-semibold">
                Start a conversation
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Use the contact form to provide the relevant information about
                your question or support request.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0f1a2a] p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <MapPin className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Location
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-200">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-teal-400/15 bg-teal-500/[0.05] p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />

                <div>
                  <h2 className="font-semibold">
                    Provide accurate information
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Include a valid email address so your message can be
                    associated with the correct sender.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
