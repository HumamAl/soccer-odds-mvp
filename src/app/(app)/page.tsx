"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Globe,
  Clock,
  BarChart2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  matches,
  dashboardStats,
  apiUsageData,
  leagues,
  getLiveMatches,
} from "@/data/mock-data";
import type { Match, OddsValue, DashboardStat } from "@/lib/types";

// ── SSR-safe chart import ─────────────────────────────────────────
const ApiUsageChart = dynamic(
  () =>
    import("@/components/dashboard/api-usage-chart").then(
      (m) => m.ApiUsageChart
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[260px] rounded-lg animate-pulse"
        style={{ background: "oklch(1 0 0 / 0.04)" }}
      />
    ),
  }
);

// ── Animated count-up hook ────────────────────────────────────────
function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Stat icon map ─────────────────────────────────────────────────
const statIcons = [Activity, Globe, Zap, Clock];

// ── Stat card component ───────────────────────────────────────────
function StatCard({
  stat,
  index,
}: {
  stat: DashboardStat;
  index: number;
}) {
  // Parse numeric value for counter — strip non-numeric for display
  const rawValue = stat.value;
  const numericPart = parseFloat(rawValue.replace(/[^0-9.]/g, ""));
  const suffix = rawValue.replace(/[0-9.]/g, "");
  const isNumeric = !isNaN(numericPart);

  const { count, ref } = useCountUp(isNumeric ? numericPart : 0, 1000 + index * 150);

  const Icon = statIcons[index % statIcons.length];
  const trendColor =
    stat.trend === "up"
      ? "var(--success)"
      : stat.trend === "down"
      ? "var(--chart-2)"
      : "var(--muted-foreground)";

  return (
    <div
      ref={ref}
      className="aesthetic-card"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "ease-out",
      }}
    >
      <div className="flex items-start justify-between">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--muted-foreground)" }}
        >
          {stat.label}
        </p>
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: "oklch(from var(--primary) l c h / 0.12)" }}
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{ color: "var(--primary)" }}
          />
        </div>
      </div>
      <div
        className="mt-3 text-3xl font-bold font-mono tabular-nums"
        style={{ color: "var(--primary)" }}
      >
        {isNumeric ? `${count}${suffix}` : rawValue}
      </div>
      {stat.change && (
        <p className="mt-1.5 text-xs" style={{ color: trendColor }}>
          {stat.trend === "up" && "▲ "}
          {stat.trend === "down" && "▼ "}
          {stat.change}
        </p>
      )}
    </div>
  );
}

// ── Match status badge ────────────────────────────────────────────
function MatchStatusBadge({ status, minute }: { status: Match["status"]; minute?: number }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
        style={{ background: "oklch(from var(--success) l c h / 0.15)", color: "var(--success)" }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--success)" }} />
        {minute}&apos;
      </span>
    );
  }
  if (status === "half-time") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
        style={{ background: "oklch(from var(--warning) l c h / 0.15)", color: "var(--warning)" }}>
        HT
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide"
        style={{ background: "oklch(1 0 0 / 0.06)", color: "var(--muted-foreground)" }}>
        FT
      </span>
    );
  }
  if (status === "postponed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide"
        style={{ background: "oklch(from var(--destructive) l c h / 0.15)", color: "var(--destructive)" }}>
        PPD
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide"
        style={{ background: "oklch(from var(--destructive) l c h / 0.15)", color: "var(--destructive)" }}>
        SUSP
      </span>
    );
  }
  // upcoming
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: "oklch(1 0 0 / 0.05)", color: "var(--muted-foreground)" }}>
      Pre
    </span>
  );
}

// ── Odds cell with movement indicator ────────────────────────────
function OddsCell({ odds, label }: { odds: OddsValue; label: string }) {
  const isUp = odds.movement === "up";
  const isDown = odds.movement === "down";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </span>
      <div className="flex items-center gap-0.5">
        {isUp && <ChevronUp className="w-3 h-3" style={{ color: "var(--success)" }} />}
        {isDown && <ChevronDown className="w-3 h-3" style={{ color: "var(--destructive)" }} />}
        {!isUp && !isDown && <Minus className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />}
        <span
          className="text-sm font-mono font-semibold tabular-nums"
          style={{
            color: isUp
              ? "var(--success)"
              : isDown
              ? "var(--destructive)"
              : "var(--foreground)",
          }}
        >
          {odds.decimal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ── Kickoff time formatter ────────────────────────────────────────
function formatKickoff(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffM = Math.floor((diffMs % 3600000) / 60000);

  if (diffH <= 0 && diffM <= 0) return "Now";
  if (diffH < 1) return `${diffM}m`;
  if (diffH < 24) return `${diffH}h ${diffM}m`;

  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// ── Main page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const [leagueFilter, setLeagueFilter] = useState<string>("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const liveAndHalfTimeMatches = useMemo(() => getLiveMatches(), []);

  const filteredUpcomingMatches = useMemo(() => {
    let pool = matches.filter((m) => m.status === "upcoming");
    if (leagueFilter !== "all") {
      pool = pool.filter((m) => m.leagueId === leagueFilter);
    }
    if (showFeaturedOnly) {
      pool = pool.filter((m) => m.isFeatured);
    }
    return pool.slice(0, 6);
  }, [leagueFilter, showFeaturedOnly]);

  const liveCount = liveAndHalfTimeMatches.length;

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight aesthetic-heading"
            style={{ color: "var(--foreground)" }}
          >
            Live Odds Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Real-time odds across {leagues.length} leagues · {liveCount} matches in play
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--success)" }}
          />
          <span className="text-xs font-medium" style={{ color: "var(--success)" }}>
            Feed active
          </span>
        </div>
      </div>

      {/* ── KPI stat cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* ── Live Matches — hero section ─────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: "var(--success)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Matches In Play
          </h2>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ background: "oklch(from var(--success) l c h / 0.12)", color: "var(--success)" }}
          >
            {liveCount}
          </span>
        </div>

        {liveAndHalfTimeMatches.length === 0 ? (
          <div
            className="aesthetic-card text-center text-sm py-10"
            style={{ color: "var(--muted-foreground)" }}
          >
            No matches currently in play
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {liveAndHalfTimeMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* ── Upcoming Matches with league filter ─────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Upcoming Fixtures
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Featured toggle */}
            <button
              onClick={() => setShowFeaturedOnly((v) => !v)}
              className={cn(
                "px-3 py-1 text-xs rounded-md border transition-colors",
                showFeaturedOnly
                  ? "border-primary/60 text-primary bg-primary/10"
                  : "border-white/10 text-muted-foreground hover:bg-white/5"
              )}
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              Featured
            </button>

            {/* League pills */}
            {(["all", ...leagues.map((l) => l.id)] as string[]).map((id) => {
              const league = leagues.find((l) => l.id === id);
              const label = id === "all" ? "All Leagues" : (league?.logoEmoji ?? "") + " " + (league?.name ?? id);
              return (
                <button
                  key={id}
                  onClick={() => setLeagueFilter(id)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md border transition-colors whitespace-nowrap",
                    leagueFilter === id
                      ? "border-primary/60 text-primary bg-primary/10"
                      : "border-white/10 text-muted-foreground hover:bg-white/5"
                  )}
                  style={{ transitionDuration: "var(--dur-fast)" }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredUpcomingMatches.length === 0 ? (
          <div
            className="aesthetic-card text-center text-sm py-10"
            style={{ color: "var(--muted-foreground)" }}
          >
            No upcoming fixtures match the current filter
          </div>
        ) : (
          <div className="aesthetic-card overflow-hidden" style={{ padding: 0 }}>
            {/* Header row */}
            <div
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border-b"
              style={{
                color: "var(--muted-foreground)",
                borderColor: "oklch(1 0 0 / 0.07)",
                background: "oklch(1 0 0 / 0.03)",
              }}
            >
              <span>Match</span>
              <span className="w-16 text-center">1</span>
              <span className="w-16 text-center">X</span>
              <span className="w-16 text-center">2</span>
              <span className="w-20 text-right">Kickoff</span>
            </div>
            {filteredUpcomingMatches.map((match, i) => (
              <UpcomingMatchRow key={match.id} match={match} index={i} total={filteredUpcomingMatches.length} />
            ))}
          </div>
        )}
      </div>

      {/* ── API Usage chart ──────────────────────────────────────── */}
      <div className="aesthetic-card" style={{ padding: 0 }}>
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "oklch(1 0 0 / 0.07)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" style={{ color: "var(--primary)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                API Performance
              </h2>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Monthly request volume and average response latency
            </p>
          </div>
          <div
            className="text-right"
          >
            <p className="text-xs font-mono font-semibold" style={{ color: "var(--primary)" }}>
              2.1M
            </p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              requests / mo
            </p>
          </div>
        </div>
        <div className="px-4 py-4">
          <ApiUsageChart data={apiUsageData} />
        </div>
      </div>

      {/* ── Bookmaker quick view ─────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Odds Feed Health
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["bet365", "Pinnacle", "Betfair", "William Hill"] as const).map((name) => {
            const isHealthy = name !== "William Hill";
            return (
              <div
                key={name}
                className="aesthetic-card"
                style={{ padding: "var(--card-padding-sm)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {name}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: isHealthy ? "var(--success)" : "var(--warning)" }}
                  />
                </div>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {isHealthy ? "Synced" : "Delayed"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom proposal banner ───────────────────────────────── */}
      <div
        className="rounded-lg border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "oklch(from var(--primary) 0.10 0.04 h / 1)",
          borderColor: "oklch(from var(--primary) l c h / 0.20)",
        }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            This is a live demo built for{" "}
            <span style={{ color: "var(--primary)" }}>
              {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
            </span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs transition-colors"
            style={{ color: "var(--muted-foreground)", transitionDuration: "var(--dur-fast)" }}
          >
            My Approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              transitionDuration: "var(--dur-fast)",
            }}
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Live match card (extracted to keep JSX readable) ─────────────
function LiveMatchCard({ match }: { match: Match }) {
  return (
    <div
      className="aesthetic-card"
      style={{ padding: "var(--card-padding)" }}
    >
      {/* League + status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {match.leagueName}
        </span>
        <MatchStatusBadge status={match.status} minute={match.minute} />
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>
            {match.homeTeam.name}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
            {match.awayTeam.name}
          </p>
        </div>

        {match.homeScore !== undefined && match.awayScore !== undefined && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg mx-3"
            style={{ background: "oklch(1 0 0 / 0.06)" }}
          >
            <span
              className="text-xl font-bold font-mono tabular-nums"
              style={{ color: "var(--foreground)" }}
            >
              {match.homeScore}
            </span>
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>–</span>
            <span
              className="text-xl font-bold font-mono tabular-nums"
              style={{ color: "var(--foreground)" }}
            >
              {match.awayScore}
            </span>
          </div>
        )}
      </div>

      {/* 1X2 odds */}
      <div
        className="grid grid-cols-3 gap-2 pt-3 border-t"
        style={{ borderColor: "oklch(1 0 0 / 0.07)" }}
      >
        <OddsCell odds={match.odds.home} label="1" />
        <OddsCell odds={match.odds.draw} label="X" />
        <OddsCell odds={match.odds.away} label="2" />
      </div>

      {/* Over/Under if available */}
      {match.overUnder && (
        <div
          className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t"
          style={{ borderColor: "oklch(1 0 0 / 0.05)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              O {match.overUnder.line}
            </span>
            <span className="text-xs font-mono font-semibold" style={{ color: "var(--foreground)" }}>
              {match.overUnder.over.decimal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              U {match.overUnder.line}
            </span>
            <span className="text-xs font-mono font-semibold" style={{ color: "var(--foreground)" }}>
              {match.overUnder.under.decimal.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Upcoming match table row ──────────────────────────────────────
function UpcomingMatchRow({
  match,
  index,
  total,
}: {
  match: Match;
  index: number;
  total: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 px-4 py-3 aesthetic-hover",
        index < total - 1 && "border-b"
      )}
      style={{ borderColor: "oklch(1 0 0 / 0.06)" }}
    >
      {/* Match names */}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
          {match.homeTeam.shortName} vs {match.awayTeam.shortName}
        </p>
        <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          {match.leagueName}
        </p>
      </div>

      {/* 1 */}
      <div className="w-16 text-center">
        <span
          className="text-sm font-mono font-semibold tabular-nums"
          style={{
            color:
              match.odds.home.movement === "up"
                ? "var(--success)"
                : match.odds.home.movement === "down"
                ? "var(--destructive)"
                : "var(--foreground)",
          }}
        >
          {match.odds.home.decimal.toFixed(2)}
        </span>
      </div>

      {/* X */}
      <div className="w-16 text-center">
        <span
          className="text-sm font-mono font-semibold tabular-nums"
          style={{
            color:
              match.odds.draw.movement === "up"
                ? "var(--success)"
                : match.odds.draw.movement === "down"
                ? "var(--destructive)"
                : "var(--foreground)",
          }}
        >
          {match.odds.draw.decimal.toFixed(2)}
        </span>
      </div>

      {/* 2 */}
      <div className="w-16 text-center">
        <span
          className="text-sm font-mono font-semibold tabular-nums"
          style={{
            color:
              match.odds.away.movement === "up"
                ? "var(--success)"
                : match.odds.away.movement === "down"
                ? "var(--destructive)"
                : "var(--foreground)",
          }}
        >
          {match.odds.away.decimal.toFixed(2)}
        </span>
      </div>

      {/* Kickoff */}
      <div className="w-20 text-right">
        <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
          {formatKickoff(match.kickoff)}
        </span>
      </div>
    </div>
  );
}
