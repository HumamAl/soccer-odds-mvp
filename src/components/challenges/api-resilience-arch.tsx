// No "use client" — pure JSX, no hooks

import type { ElementType } from "react";
import { Smartphone, Shield, Globe, Database, Flame, ArrowDown } from "lucide-react";

interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  icon: ElementType;
  type: "client" | "gateway" | "provider" | "cache" | "realtime";
  badge?: string;
  badgeType?: "success" | "warning";
}

const layers: ArchNode[] = [
  {
    id: "app",
    label: "React Native App",
    sublabel: "iOS + Android",
    icon: Smartphone,
    type: "client",
  },
  {
    id: "gateway",
    label: "API Gateway",
    sublabel: "Rate limiter + retry queue",
    icon: Shield,
    type: "gateway",
    badge: "Exponential backoff",
    badgeType: "warning",
  },
  {
    id: "provider",
    label: "Odds Provider",
    sublabel: "The-Odds-API / BetAPI",
    icon: Globe,
    type: "provider",
    badge: "External — can fail",
    badgeType: "warning",
  },
  {
    id: "cache",
    label: "Cache Layer",
    sublabel: "MMKV + stale-age tracker",
    icon: Database,
    type: "cache",
    badge: "Fallback active",
    badgeType: "success",
  },
  {
    id: "rtdb",
    label: "Firebase RT DB",
    sublabel: "Last-known odds broadcast",
    icon: Flame,
    type: "realtime",
    badge: "99.9% uptime SLA",
    badgeType: "success",
  },
];

const typeStyles: Record<
  string,
  { border: string; bg: string; iconColor: string }
> = {
  client: {
    border: "color-mix(in oklch, var(--primary) 30%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 8%, transparent)",
    iconColor: "var(--primary)",
  },
  gateway: {
    border: "color-mix(in oklch, var(--warning) 30%, transparent)",
    bg: "color-mix(in oklch, var(--warning) 6%, transparent)",
    iconColor: "var(--warning)",
  },
  provider: {
    border: "color-mix(in oklch, var(--border) 100%, transparent)",
    bg: "color-mix(in oklch, var(--muted) 80%, transparent)",
    iconColor: "var(--muted-foreground)",
  },
  cache: {
    border: "color-mix(in oklch, var(--primary) 20%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 5%, transparent)",
    iconColor: "var(--primary)",
  },
  realtime: {
    border: "color-mix(in oklch, var(--primary) 30%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 8%, transparent)",
    iconColor: "var(--primary)",
  },
};

export function ApiResilienceArch() {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground pb-1">
        Resilience architecture — graceful degradation path
      </p>

      {layers.map((node, i) => {
        const styles = typeStyles[node.type];
        const Icon = node.icon;

        return (
          <div key={node.id}>
            <div
              className="rounded-lg border px-3 py-2.5 flex items-center justify-between gap-3"
              style={{
                borderColor: styles.border,
                backgroundColor: styles.bg,
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: styles.iconColor }}
                />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {node.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{node.sublabel}</p>
                </div>
              </div>
              {node.badge && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded shrink-0"
                  style={{
                    backgroundColor:
                      node.badgeType === "success"
                        ? "color-mix(in oklch, var(--primary) 10%, transparent)"
                        : "color-mix(in oklch, var(--warning) 12%, transparent)",
                    color:
                      node.badgeType === "success"
                        ? "var(--primary)"
                        : "var(--warning)",
                  }}
                >
                  {node.badge}
                </span>
              )}
            </div>

            {/* Connector arrow */}
            {i < layers.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Uptime callout */}
      <div
        className="mt-2 rounded-lg border px-3 py-2 flex items-center justify-between"
        style={{
          borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
          backgroundColor: "color-mix(in oklch, var(--primary) 6%, transparent)",
        }}
      >
        <span className="text-xs text-muted-foreground">
          Perceived uptime with cache fallback
        </span>
        <span
          className="text-sm font-bold font-mono"
          style={{ color: "var(--primary)" }}
        >
          99.5%+
        </span>
      </div>
    </div>
  );
}
