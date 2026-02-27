// No "use client" — pure JSX, no hooks

import { TrendingUp } from "lucide-react";

interface OutcomeStatementProps {
  outcome: string;
}

export function OutcomeStatement({ outcome }: OutcomeStatementProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-lg px-3 py-2.5"
      style={{
        backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)",
        borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "0 0 8px color-mix(in oklch, var(--primary) 6%, transparent)",
      }}
    >
      <TrendingUp
        className="h-4 w-4 mt-0.5 shrink-0"
        style={{ color: "var(--primary)" }}
      />
      <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>
        {outcome}
      </p>
    </div>
  );
}
