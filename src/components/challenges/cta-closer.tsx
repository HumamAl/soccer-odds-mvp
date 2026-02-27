// No "use client" — pure JSX, no hooks

import Link from "next/link";

export function CtaCloser() {
  return (
    <section
      className="rounded-lg p-6"
      style={{
        background: "oklch(0.10 0.015 145)",
        border: "1px solid color-mix(in oklch, var(--primary) 20%, transparent)",
        boxShadow:
          "0 0 0 1px oklch(1 0 0 / 0.04), inset 0 1px 0 oklch(1 0 0 / 0.06)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: "oklch(0.92 0 0)" }}
          >
            Ready to discuss the approach?
          </h3>
          <p className="text-sm max-w-md" style={{ color: "oklch(0.60 0 0)" }}>
            I&apos;ve thought through the hard parts of real-time odds sync and
            cross-platform performance. Happy to walk through any of this on a call.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/proposal"
            className="text-sm text-white/40 hover:text-white/60 transition-colors duration-[200ms]"
          >
            See the proposal →
          </Link>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklch, var(--primary) 20%, transparent), color-mix(in oklch, var(--primary) 10%, transparent))",
              border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
              color: "var(--primary)",
              boxShadow: "0 0 12px color-mix(in oklch, var(--primary) 12%, transparent)",
            }}
          >
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </section>
  );
}
