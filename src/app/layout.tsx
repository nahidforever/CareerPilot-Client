import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CareerPilot AI",
    template: "%s | CareerPilot AI",
  },
  description:
    "Discover relevant jobs, publish opportunities, and navigate your career with AI-powered guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b1422] text-white antialiased">
        <Navbar />

        {children}

        <Toaster
          position="top-right"
          richColors
          theme="dark"
          closeButton
        />
      </body>
    </html>
  );
}