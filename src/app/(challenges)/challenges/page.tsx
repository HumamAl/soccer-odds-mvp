// Server component — no "use client"

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { challenges, executiveSummary } from "@/data/challenges";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { CtaCloser } from "@/components/challenges/cta-closer";
import { OddsSyncFlow } from "@/components/challenges/odds-sync-flow";
import { PlatformBeforeAfter } from "@/components/challenges/platform-before-after";
import { ApiResilienceArch } from "@/components/challenges/api-resilience-arch";

export const metadata: Metadata = {
  title: "My Approach | OddsView Demo by Humam",
};

const visualizationMap: Record<string, ReactNode> = {
  "challenge-1": <OddsSyncFlow />,
  "challenge-2": <PlatformBeforeAfter />,
  "challenge-3": <ApiResilienceArch />,
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            My Engineering Approach
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            How I&apos;d tackle the core technical challenges in this React Native odds app
          </p>
        </div>

        {/* Executive summary — dark hero banner */}
        <ExecutiveSummary
          commonApproach={executiveSummary.commonApproach}
          differentApproach={executiveSummary.differentApproach}
          accentWord={executiveSummary.accentWord}
        />

        {/* Challenge cards */}
        <div className="flex flex-col gap-4">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              outcome={challenge.outcome}
              index={index}
              visualization={visualizationMap[challenge.id]}
            />
          ))}
        </div>

        {/* CTA closer */}
        <CtaCloser />

      </div>
    </div>
  );
}
