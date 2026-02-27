"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { ArrowRight, Wifi, GitMerge, Database, Monitor, ChevronDown, ChevronUp } from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  icon: ElementType;
  highlight?: boolean;
  detail: string;
}

const nodes: FlowNode[] = [
  {
    id: "ws",
    label: "WebSocket",
    sublabel: "Odds API stream",
    icon: Wifi,
    detail: "Persistent WS connection — no polling overhead. Receives odds diffs as JSON patches at up to 400 msg/sec.",
  },
  {
    id: "diff",
    label: "Diff Engine",
    sublabel: "Batch & deduplicate",
    icon: GitMerge,
    highlight: true,
    detail: "Collects updates in a 16ms window (one frame), deduplicates by matchId+marketId, then applies a single merged patch to state.",
  },
  {
    id: "cache",
    label: "State Cache",
    sublabel: "MMKV local store",
    icon: Database,
    detail: "Persists last-known odds to MMKV — sub-millisecond reads. App launches instantly with cached data before the WS reconnects.",
  },
  {
    id: "ui",
    label: "Odds UI",
    sublabel: "Memoized cells",
    icon: Monitor,
    detail: "Each odds cell is memoized on its specific value. Only the changed cell re-renders — not the entire table.",
  },
];

export function OddsSyncFlow() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Update pipeline — click a stage to expand
      </p>

      {/* Flow nodes */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
        {nodes.map((node, i) => {
          const isExpanded = expanded === node.id;
          const Icon = node.icon;

          return (
            <div key={node.id} className="flex sm:flex-col items-center gap-2 flex-1">
              <button
                onClick={() => setExpanded(isExpanded ? null : node.id)}
                className="w-full text-left"
              >
                <div
                  className="rounded-lg border px-3 py-2.5 transition-all duration-[200ms] w-full"
                  style={{
                    borderColor: node.highlight
                      ? "color-mix(in oklch, var(--primary) 35%, transparent)"
                      : "color-mix(in oklch, var(--border) 100%, transparent)",
                    backgroundColor: node.highlight
                      ? "color-mix(in oklch, var(--primary) 10%, transparent)"
                      : isExpanded
                      ? "color-mix(in oklch, var(--muted) 100%, transparent)"
                      : "var(--card)",
                    boxShadow: node.highlight
                      ? "0 0 12px color-mix(in oklch, var(--primary) 15%, transparent)"
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-3.5 h-3.5 shrink-0"
                        style={{
                          color: node.highlight ? "var(--primary)" : "var(--muted-foreground)",
                        }}
                      />
                      <div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: node.highlight ? "var(--primary)" : "var(--foreground)" }}
                        >
                          {node.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {node.sublabel}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </div>
              </button>

              {/* Arrow between nodes — hidden on mobile (stacked vertically there) */}
              {i < nodes.length - 1 && (
                <ArrowRight
                  className="w-3.5 h-3.5 shrink-0 hidden sm:block mt-3"
                  style={{ color: "var(--muted-foreground)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div
          className="rounded-lg border px-4 py-3 text-sm leading-relaxed transition-all duration-[200ms]"
          style={{
            borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--primary) 6%, transparent)",
            color: "var(--foreground)",
          }}
        >
          {nodes.find((n) => n.id === expanded)?.detail}
        </div>
      )}

      {/* Latency callout */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <span className="text-xs text-muted-foreground font-mono">
            API tick → rendered cell: &lt;100ms target
          </span>
        </div>
        <div
          className="text-[10px] font-mono px-2 py-0.5 rounded"
          style={{
            backgroundColor: "color-mix(in oklch, var(--primary) 10%, transparent)",
            color: "var(--primary)",
          }}
        >
          16ms batch window
        </div>
      </div>
    </div>
  );
}
