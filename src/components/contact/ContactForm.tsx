"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";
import type {
  ContactMessageInput,
  ContactMessageResponse,
} from "@/types/contact";

const inputClassName =
  "h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName = "mb-2 block text-sm font-medium text-slate-300";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messageLength, setMessageLength] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: ContactMessageInput = {
      name: String(formData.get("name") || "").trim(),

      email: String(formData.get("email") || "")
        .trim()
        .toLowerCase(),

      subject: String(formData.get("subject") || "").trim(),

      message: String(formData.get("message") || "").trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (payload.name.length < 2) {
      toast.error("Please provide a valid name.");
      return;
    }

    if (payload.message.length < 10) {
      toast.error("Your message must contain at least 10 characters.");
      return;
    }

    const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

    if (!serverUri) {
      toast.error("Server URL is not configured.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${serverUri}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response
        .json()
        .catch(() => null)) as ContactMessageResponse | null;

      if (!response.ok) {
        toast.error(result?.message || "Unable to send your message.");
        return;
      }

      toast.success(
        result?.message || "Your message has been sent successfully.",
      );

      form.reset();
      setMessageLength(0);
    } catch {
      toast.error("Something went wrong while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-[#0f1a2a] p-5 shadow-2xl shadow-black/15 sm:p-7 lg:p-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">
          Contact form
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Send us a message
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Complete the form below with your question, feedback or support
          request.
        </p>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClassName}>
            Full name
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Enter your full name"
            disabled={isSubmitting}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClassName}>
            Email address
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            placeholder="Enter your email address"
            disabled={isSubmitting}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-subject" className={labelClassName}>
          Subject
        </label>

        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue=""
          disabled={isSubmitting}
          className={inputClassName}
        >
          <option value="" disabled>
            Select a message subject
          </option>

          <option value="General inquiry">General inquiry</option>

          <option value="Job listing support">Job listing support</option>

          <option value="Technical support">Technical support</option>

          <option value="Partnership inquiry">Partnership inquiry</option>

          <option value="Feedback">Feedback</option>
        </select>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="contact-message"
            className="text-sm font-medium text-slate-300"
          >
            Message
          </label>

          <span className="text-xs text-slate-600">{messageLength}/2000</span>
        </div>

        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={7}
          placeholder="Write your message here..."
          disabled={isSubmitting}
          onChange={(event) => setMessageLength(event.target.value.length)}
          className="w-full resize-none rounded-xl border border-white/10 bg-[#111d2d] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Sending message...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
