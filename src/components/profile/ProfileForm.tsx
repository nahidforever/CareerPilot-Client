"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CircleUserRound,
  ImageIcon,
  LoaderCircle,
  Mail,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface ProfileFormProps {
  initialName: string;
  email: string;
  initialImage: string | null;
}

function getInitials(name: string) {
  if (!name.trim()) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function isValidImageUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const inputClassName =
  "h-12 w-full rounded-xl border border-white/10 bg-[#111d2d] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

export default function ProfileForm({
  initialName,
  email,
  initialImage,
}: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage || "");

  const [savedName, setSavedName] = useState(initialName);

  const [savedImage, setSavedImage] = useState(initialImage || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedName = name.trim();
  const normalizedImage = image.trim();

  const hasChanges =
    normalizedName !== savedName.trim() ||
    normalizedImage !== savedImage.trim();

  const imageIsValid = isValidImageUrl(normalizedImage);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (normalizedName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    if (normalizedName.length > 80) {
      toast.error("Name cannot exceed 80 characters.");
      return;
    }

    if (!imageIsValid) {
      toast.error("Please provide a valid HTTP or HTTPS image URL.");
      return;
    }

    if (!hasChanges) {
      toast.info("No profile changes to save.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.updateUser({
        name: normalizedName,
        image: normalizedImage || null,
      });

      if (error) {
        toast.error(error.message || "Unable to update your profile.");
        return;
      }

      setName(normalizedName);
      setImage(normalizedImage);
      setSavedName(normalizedName);
      setSavedImage(normalizedImage);

      toast.success("Profile updated successfully.");

      router.refresh();
    } catch {
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-xl shadow-black/10">
      <div className="border-b border-white/10 px-5 py-5 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-400">
          Edit profile
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          Update your information
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Change your display name or profile image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-7">
        {/* Live preview */}
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-center sm:flex-row sm:text-left">
          {normalizedImage && imageIsValid ? (
            <span
              role="img"
              aria-label={`${normalizedName || "User"} profile preview`}
              className="h-24 w-24 shrink-0 rounded-2xl border border-white/10 bg-slate-800 bg-cover bg-center shadow-xl"
              style={{
                backgroundImage: `url("${normalizedImage}")`,
              }}
            />
          ) : (
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 text-2xl font-bold text-white shadow-xl">
              {getInitials(normalizedName)}
            </span>
          )}

          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold text-white">
              {normalizedName || "CareerPilot User"}
            </h3>

            <p className="mt-1 break-all text-sm text-slate-500">{email}</p>

            <p className="mt-3 text-xs leading-5 text-slate-600">
              Your profile preview updates while you edit the form.
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          {/* Name */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="profile-name"
                className="text-sm font-medium text-slate-300"
              >
                Display name
              </label>

              <span className="text-xs text-slate-600">{name.length}/80</span>
            </div>

            <div className="relative">
              <CircleUserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                disabled={isSubmitting}
                placeholder="Enter your display name"
                className={`${inputClassName} pl-11`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                id="profile-email"
                type="email"
                value={email}
                readOnly
                disabled
                className={`${inputClassName} cursor-not-allowed pl-11 opacity-60`}
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Email address cannot currently be changed.
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="profile-image"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Profile image URL
            </label>

            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                id="profile-image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                maxLength={1000}
                disabled={isSubmitting}
                placeholder="https://example.com/profile.jpg"
                className={`${inputClassName} pl-11`}
              />
            </div>

            {!imageIsValid && (
              <p className="mt-2 text-xs text-red-400">
                Enter a valid HTTP or HTTPS image URL.
              </p>
            )}

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Leave this field empty to display your initials instead.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600">
            Changes will also appear in your Navbar.
          </p>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !hasChanges ||
              normalizedName.length < 2 ||
              !imageIsValid
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving changes...
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
    </section>
  );
}
