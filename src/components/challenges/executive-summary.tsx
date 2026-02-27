// No "use client" — pure JSX, no hooks

import Link from "next/link";

interface ExecutiveSummaryProps {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export function ExecutiveSummary({
  commonApproach,
  differentApproach,
  accentWord,
}: ExecutiveSummaryProps) {
  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span
              key={i}
              className="font-semibold"
              style={{
                color: "var(--primary)",
                textShadow: "0 0 20px color-mix(in oklch, var(--primary) 30%, transparent)",
              }}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg p-6 md:p-8"
      style={{
        background: "oklch(0.08 0.02 145)",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--primary) 8%, transparent), transparent 65%)",
        border: "1px solid color-mix(in oklch, var(--primary) 15%, transparent)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.05)",
      }}
    >
      <p className="text-sm md:text-base leading-relaxed" style={{ color: "oklch(0.70 0 0)" }}>
        {commonApproach}
      </p>
      <hr
        className="my-4"
        style={{ borderColor: "color-mix(in oklch, var(--primary) 15%, transparent)" }}
      />
      <p
        className="text-base md:text-lg leading-relaxed font-medium"
        style={{ color: "oklch(0.92 0 0)" }}
      >
        {renderDifferentApproach()}
      </p>
      <p className="text-xs mt-4 text-white/40">
        ←{" "}
        <Link
          href="/"
          className="underline underline-offset-2 transition-colors duration-[200ms] text-white/50 hover:text-white/70"
        >
          Back to the live demo
        </Link>
      </p>
    </div>
  );
}
