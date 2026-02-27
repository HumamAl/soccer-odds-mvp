"use client";

import { useState } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

const beforeItems = [
  "Separate iOS (Swift) and Android (Kotlin) codebases",
  "Business logic duplicated — odds formatting, bet calculation",
  "iOS gets polished UI first; Android ships weeks later",
  "Two test suites, two CI pipelines, 2x maintenance cost",
  "Mid-range Android shows dropped frames on odds scroll",
];

const afterItems = [
  "Single React Native codebase — one feature PR ships everywhere",
  "Shared odds engine: formatting, handicap logic, margin calc",
  "Platform-conditional animations: 60fps budget on both",
  "FlatList with getItemLayout for instant scroll position",
  "Memoized odds cells — only changed prices re-render",
];

export function PlatformBeforeAfter() {
  const [view, setView] = useState<"before" | "after">("before");

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div
        className="inline-flex rounded-lg p-1 gap-1"
        style={{ backgroundColor: "color-mix(in oklch, var(--muted) 100%, transparent)" }}
      >
        <button
          onClick={() => setView("before")}
          className="px-3 py-1.5 rounded text-xs font-medium transition-all duration-[200ms]"
          style={{
            backgroundColor:
              view === "before"
                ? "color-mix(in oklch, var(--destructive) 15%, transparent)"
                : "transparent",
            color: view === "before" ? "var(--destructive)" : "var(--muted-foreground)",
            borderColor:
              view === "before"
                ? "color-mix(in oklch, var(--destructive) 25%, transparent)"
                : "transparent",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          Current Problem
        </button>
        <button
          onClick={() => setView("after")}
          className="px-3 py-1.5 rounded text-xs font-medium transition-all duration-[200ms]"
          style={{
            backgroundColor:
              view === "after"
                ? "color-mix(in oklch, var(--primary) 12%, transparent)"
                : "transparent",
            color: view === "after" ? "var(--primary)" : "var(--muted-foreground)",
            borderColor:
              view === "after"
                ? "color-mix(in oklch, var(--primary) 25%, transparent)"
                : "transparent",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          My Solution
        </button>
      </div>

      {/* Content panel */}
      <div
        className="rounded-lg border p-4 transition-all duration-[200ms]"
        style={{
          borderColor:
            view === "before"
              ? "color-mix(in oklch, var(--destructive) 25%, transparent)"
              : "color-mix(in oklch, var(--primary) 25%, transparent)",
          backgroundColor:
            view === "before"
              ? "color-mix(in oklch, var(--destructive) 7%, transparent)"
              : "color-mix(in oklch, var(--primary) 7%, transparent)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{
            color: view === "before" ? "var(--destructive)" : "var(--primary)",
          }}
        >
          {view === "before" ? "Two native codebases" : "Single RN codebase"}
        </p>
        <ul className="space-y-2">
          {(view === "before" ? beforeItems : afterItems).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              {view === "before" ? (
                <XCircle
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "var(--destructive)" }}
                />
              ) : (
                <CheckCircle2
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "var(--primary)" }}
                />
              )}
              <span style={{ color: "var(--foreground)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Platform stat row */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[
          { platform: "iOS", metric: "60fps", note: "Metal-backed views" },
          { platform: "Android", metric: "60fps", note: "Virtualized list" },
        ].map((p) => (
          <div
            key={p.platform}
            className="rounded-lg border px-3 py-2 text-center"
            style={{
              borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
              backgroundColor: "color-mix(in oklch, var(--primary) 5%, transparent)",
            }}
          >
            <p className="text-xs text-muted-foreground">{p.platform}</p>
            <p
              className="text-lg font-bold font-mono"
              style={{ color: "var(--primary)" }}
            >
              {p.metric}
            </p>
            <p className="text-[10px] text-muted-foreground">{p.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
