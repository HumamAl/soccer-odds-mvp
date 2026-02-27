"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { leagues, getMatchesByLeague } from "@/data/mock-data";
import type { League, Match, MatchStatus } from "@/lib/types";
import { ChevronUp, ChevronDown } from "lucide-react";

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

// ── Odds Movement ─────────────────────────────────────────────────────────

function OddsCell({ decimal, movement }: { decimal: number; movement: string }) {
  return (
    <span
      className={cn(
        "font-mono text-sm tabular-nums",
        movement === "up" && "text-[color:var(--success)]",
        movement === "down" && "text-destructive",
        movement === "stable" && "text-foreground"
      )}
    >
      {decimal.toFixed(2)}
      {movement === "up" && <span className="ml-0.5 text-xs">▲</span>}
      {movement === "down" && <span className="ml-0.5 text-xs">▼</span>}
    </span>
  );
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
    if (diffH < 24) return `in ${diffH}h ${diffM}m`;
    return date.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
  }
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// ── Score Display ─────────────────────────────────────────────────────────

function ScoreDisplay({ match }: { match: Match }) {
  if (match.homeScore !== undefined && match.awayScore !== undefined) {
    return (
      <span className="font-mono text-sm font-semibold">
        {match.homeScore} – {match.awayScore}
      </span>
    );
  }
  return <span className="text-muted-foreground text-sm">vs</span>;
}

// ── League Card ───────────────────────────────────────────────────────────

function LeagueCard({
  league,
  isSelected,
  onClick,
}: {
  league: League;
  isSelected: boolean;
  onClick: () => void;
}) {
  const liveCount = getMatchesByLeague(league.id).filter(
    (m) => m.status === "live" || m.status === "half-time"
  ).length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "aesthetic-card w-full text-left cursor-pointer transition-all duration-150",
        isSelected
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
          : "hover:border-primary/20"
      )}
      style={{ padding: "var(--card-padding-sm, 1rem)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl leading-none">{league.logoEmoji}</span>
        {liveCount > 0 && (
          <span className="text-[10px] font-medium text-[color:var(--success)] bg-[color:var(--success)]/10 px-1.5 py-0.5 rounded-full border border-[color:var(--success)]/20 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[color:var(--success)] animate-pulse inline-block" />
            {liveCount} live
          </span>
        )}
      </div>
      <p className="font-semibold text-sm mt-2 leading-tight">{league.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{league.country}</p>
      <p className="text-xs font-mono text-muted-foreground mt-1.5">
        {league.matchCount} fixtures
      </p>
    </button>
  );
}

// ── Sort Types ────────────────────────────────────────────────────────────

type SortKey = "teams" | "status" | "kickoff";
type SortDir = "asc" | "desc";

// ── Page ──────────────────────────────────────────────────────────────────

export default function LeaguesPage() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(leagues[0].id);
  const [sortKey, setSortKey] = useState<SortKey>("kickoff");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const selectedLeague = leagues.find((l) => l.id === selectedLeagueId)!;
  const leagueMatches = useMemo(() => getMatchesByLeague(selectedLeagueId), [selectedLeagueId]);

  const sortedMatches = useMemo(() => {
    return [...leagueMatches].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "teams") {
        cmp = a.homeTeam.name.localeCompare(b.homeTeam.name);
      } else if (sortKey === "status") {
        const order: MatchStatus[] = ["live", "half-time", "upcoming", "finished", "postponed", "suspended"];
        cmp = order.indexOf(a.status) - order.indexOf(b.status);
      } else {
        cmp = new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [leagueMatches, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const liveInLeague = sortedMatches.filter(
    (m) => m.status === "live" || m.status === "half-time"
  ).length;

  return (
    <div className="space-y-6" style={{ padding: "var(--content-padding, 1.5rem)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">League Browser</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse fixtures and live odds across all tracked competitions
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {leagues.length} competitions tracked
          </p>
          <p className="text-xs font-mono text-[color:var(--success)] mt-0.5">
            {leagues.reduce((acc, l) => {
              const live = getMatchesByLeague(l.id).filter(
                (m) => m.status === "live" || m.status === "half-time"
              ).length;
              return acc + live;
            }, 0)}{" "}
            matches live now
          </p>
        </div>
      </div>

      {/* League grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {leagues.map((league) => (
          <LeagueCard
            key={league.id}
            league={league}
            isSelected={selectedLeagueId === league.id}
            onClick={() => setSelectedLeagueId(league.id)}
          />
        ))}
      </div>

      {/* Selected league fixture table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedLeague.logoEmoji}</span>
            <h2 className="text-lg font-semibold">{selectedLeague.name}</h2>
            {liveInLeague > 0 && (
              <Badge
                variant="outline"
                className="text-xs text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20 rounded-full"
              >
                {liveInLeague} live
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {sortedMatches.length} {sortedMatches.length === 1 ? "fixture" : "fixtures"}
          </span>
        </div>

        <div className="aesthetic-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                    onClick={() => handleSort("teams")}
                  >
                    <div className="flex items-center gap-1">
                      Home
                      {sortKey === "teams" && (
                        sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-center w-20">
                    Score
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                    Away
                  </TableHead>
                  <TableHead
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortKey === "status" && (
                        sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                    onClick={() => handleSort("kickoff")}
                  >
                    <div className="flex items-center gap-1">
                      Kickoff
                      {sortKey === "kickoff" && (
                        sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                    1 (Home)
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                    X (Draw)
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                    2 (Away)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMatches.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      No fixtures scheduled for {selectedLeague.name}.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedMatches.map((match) => (
                    <TableRow
                      key={match.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                    >
                      <TableCell className="font-medium text-sm">
                        {match.homeTeam.name}
                        <span className="ml-1.5 text-xs text-muted-foreground font-mono">
                          {match.homeTeam.shortName}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <ScoreDisplay match={match} />
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {match.awayTeam.name}
                        <span className="ml-1.5 text-xs text-muted-foreground font-mono">
                          {match.awayTeam.shortName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <MatchStatusBadge status={match.status} minute={match.minute} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {formatKickoff(match.kickoff, match.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          decimal={match.odds.home.decimal}
                          movement={match.odds.home.movement}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          decimal={match.odds.draw.decimal}
                          movement={match.odds.draw.movement}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          decimal={match.odds.away.decimal}
                          movement={match.odds.away.movement}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
