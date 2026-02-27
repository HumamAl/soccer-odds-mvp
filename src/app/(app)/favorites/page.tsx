"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { matches, getFeaturedMatches } from "@/data/mock-data";
import type { Match, MatchStatus } from "@/lib/types";
import { Star, TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";

// ── Status Badge ──────────────────────────────────────────────────────────

function MatchStatusBadge({ status, minute }: { status: MatchStatus; minute?: number }) {
  const config: Record<MatchStatus, { label: string; colorClass: string }> = {
    live: {
      label: minute ? `LIVE ${minute}'` : "LIVE",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
    },
    "half-time": {
      label: "HT",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    },
    upcoming: {
      label: "Upcoming",
      colorClass: "text-muted-foreground bg-muted border-border/40",
    },
    finished: {
      label: "FT",
      colorClass: "text-muted-foreground bg-muted border-border/40",
    },
    postponed: {
      label: "Postponed",
      colorClass: "text-destructive bg-destructive/10 border-destructive/20",
    },
    suspended: {
      label: "Suspended",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    },
  };

  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", c.colorClass)}
    >
      {status === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] mr-1.5 animate-pulse inline-block" />
      )}
      {c.label}
    </Badge>
  );
}

// ── Odds Movement Icon ─────────────────────────────────────────────────────

function MovementIcon({ movement }: { movement: string }) {
  if (movement === "up") return <TrendingUp className="w-3.5 h-3.5 text-[color:var(--success)]" />;
  if (movement === "down") return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground/40" />;
}

// ── Kickoff Formatter ──────────────────────────────────────────────────────

function formatKickoff(iso: string, status: MatchStatus): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffH = Math.floor(Math.abs(diffMs) / 3600000);
  const diffM = Math.floor((Math.abs(diffMs) % 3600000) / 60000);

  if (status === "finished") return "Full Time";
  if (status === "live" || status === "half-time") return "In Progress";
  if (status === "postponed") return "Postponed";
  if (status === "suspended") return "Suspended";

  if (diffMs > 0) {
    if (diffH < 1) return `in ${diffM}m`;
    if (diffH < 24) return `in ${diffH}h`;
    return date.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
  }
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// ── Match Card ────────────────────────────────────────────────────────────

function FavoriteMatchCard({
  match,
  isFavorited,
  onToggle,
}: {
  match: Match;
  isFavorited: boolean;
  onToggle: (id: string) => void;
}) {
  const isLive = match.status === "live" || match.status === "half-time";

  return (
    <div
      className={cn(
        "aesthetic-card relative overflow-hidden",
        isLive && "ring-1 ring-[color:var(--success)]/20"
      )}
      style={{ padding: "var(--card-padding, 1.5rem)" }}
    >
      {/* Live pulse bar */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[color:var(--success)]/40" />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{match.leagueName}</span>
          <MatchStatusBadge status={match.status} minute={match.minute} />
        </div>
        <button
          onClick={() => onToggle(match.id)}
          aria-label={isFavorited ? "Remove from watchlist" : "Add to watchlist"}
          className="transition-colors duration-150 hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              "w-5 h-5",
              isFavorited
                ? "fill-[color:var(--warning)] text-[color:var(--warning)]"
                : "text-muted-foreground/40 hover:text-[color:var(--warning)]"
            )}
          />
        </button>
      </div>

      {/* Teams & score */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{match.homeTeam.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{match.homeTeam.shortName}</p>
        </div>
        <div className="text-center shrink-0">
          {match.homeScore !== undefined && match.awayScore !== undefined ? (
            <p className="text-2xl font-bold font-mono tabular-nums">
              {match.homeScore} – {match.awayScore}
            </p>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground font-mono">
                {formatKickoff(match.kickoff, match.status)}
              </p>
              <p className="text-sm font-medium mt-0.5 text-muted-foreground">vs</p>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="font-semibold text-base truncate">{match.awayTeam.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{match.awayTeam.shortName}</p>
        </div>
      </div>

      {/* 1X2 Odds row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "1 Home", value: match.odds.home },
          { label: "X Draw", value: match.odds.draw },
          { label: "2 Away", value: match.odds.away },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-md bg-muted/40 border border-border/40 p-2 text-center"
          >
            <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
            <div className="flex items-center justify-center gap-1">
              <MovementIcon movement={value.movement} />
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  value.movement === "up" && "text-[color:var(--success)]",
                  value.movement === "down" && "text-destructive",
                  value.movement === "stable" && "text-foreground"
                )}
              >
                {value.decimal.toFixed(2)}
              </span>
            </div>
            {value.previousDecimal && (
              <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5 line-through">
                {value.previousDecimal.toFixed(2)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Over/Under if available */}
      {match.overUnder && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted/20 border border-border/30 p-1.5 text-center">
            <p className="text-[10px] text-muted-foreground">
              O{match.overUnder.line}
            </p>
            <span className="font-mono text-xs font-semibold">
              {match.overUnder.over.decimal.toFixed(2)}
            </span>
          </div>
          <div className="rounded-md bg-muted/20 border border-border/30 p-1.5 text-center">
            <p className="text-[10px] text-muted-foreground">
              U{match.overUnder.line}
            </p>
            <span className="font-mono text-xs font-semibold">
              {match.overUnder.under.decimal.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Match Row ──────────────────────────────────────────────────────────

function AddMatchRow({
  match,
  onAdd,
}: {
  match: Match;
  onAdd: (id: string) => void;
}) {
  const isLive = match.status === "live" || match.status === "half-time";
  return (
    <div
      className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {match.homeTeam.shortName} vs {match.awayTeam.shortName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{match.leagueName}</p>
        </div>
        {isLive && (
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] animate-pulse shrink-0" />
        )}
      </div>
      <button
        onClick={() => onAdd(match.id)}
        className="shrink-0 transition-colors duration-100"
        aria-label="Add to watchlist"
      >
        <Star className="w-4 h-4 text-muted-foreground/40 hover:text-[color:var(--warning)] transition-colors duration-100" />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  // Seed favorites with isFeatured matches
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(
    () => new Set(getFeaturedMatches().map((m) => m.id))
  );

  function toggleFavorite(id: string) {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const favoritedMatches = useMemo(
    () => matches.filter((m) => favoritedIds.has(m.id)),
    [favoritedIds]
  );

  const unfavoritedMatches = useMemo(
    () => matches.filter((m) => !favoritedIds.has(m.id)),
    [favoritedIds]
  );

  const liveCount = favoritedMatches.filter(
    (m) => m.status === "live" || m.status === "half-time"
  ).length;

  return (
    <div className="space-y-6" style={{ padding: "var(--content-padding, 1.5rem)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track odds movements on your pinned fixtures
          </p>
        </div>
        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[color:var(--success)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] animate-pulse" />
              {liveCount} live now
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            {favoritedIds.size} pinned
          </span>
          {favoritedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setFavoritedIds(new Set())}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Favorited matches */}
      {favoritedMatches.length === 0 ? (
        <div className="aesthetic-card flex flex-col items-center justify-center py-16 text-center"
          style={{ padding: "var(--card-padding)" }}
        >
          <Trophy className="w-10 h-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Your watchlist is empty</p>
          <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
            Pin fixtures below to track their live odds and price movements in one place.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritedMatches.map((match, index) => (
            <div
              key={match.id}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <FavoriteMatchCard
                match={match}
                isFavorited={true}
                onToggle={toggleFavorite}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add more fixtures section */}
      {unfavoritedMatches.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-xs">
            Add to Watchlist
          </h2>
          <div className="aesthetic-card divide-y divide-border/30 overflow-hidden p-0">
            {unfavoritedMatches.map((match) => (
              <div key={match.id} className="px-2">
                <AddMatchRow match={match} onAdd={toggleFavorite} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
