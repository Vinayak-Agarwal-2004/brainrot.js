"use client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
//@ts-ignore
import LagRadar from "react-lag-radar";
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'always',
  })
}
  return (
    <ThemeProvider attribute="class">
      <PostHogProvider client={posthog}>
        {/* <div className="fixed bottom-4 left-4 z-20 rounded-full border bg-primary/20">
          {process.env.NEXT_PUBLIC_ENV === "LOCAL" && <LagRadar />}
        </div> */}
        {children}
      </PostHogProvider>
      <Toaster
        richColors
        position="top-center"
        visibleToasts={1}
        duration={2000}
      />
    </ThemeProvider>
  );
};

export default Providers;
