// No "use client" — pure JSX, no hooks

import type { ReactNode } from "react";
import { OutcomeStatement } from "./outcome-statement";

interface ChallengeCardProps {
  title: string;
  description: string;
  outcome?: string;
  index: number;
  visualization?: ReactNode;
  className?: string;
}

export function ChallengeCard({
  title,
  description,
  outcome,
  index,
  visualization,
  className,
}: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`rounded-lg p-6 space-y-4 ${className ?? ""}`}
      style={{
        backgroundColor: "var(--card)",
        border: "var(--card-border-width, 1px) solid var(--border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-sm font-medium w-6 shrink-0 tabular-nums"
          style={{
            color: "var(--primary)",
            textShadow: "0 0 10px color-mix(in oklch, var(--primary) 40%, transparent)",
          }}
        >
          {stepNumber}
        </span>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {description}
          </p>
        </div>
      </div>

      {visualization && (
        <div className="pl-9">
          {visualization}
        </div>
      )}

      {outcome && (
        <div className="pl-9">
          <OutcomeStatement outcome={outcome} />
        </div>
      )}
    </div>
  );
}
