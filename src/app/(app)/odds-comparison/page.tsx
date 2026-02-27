"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { matches, bookmakers } from "@/data/mock-data";
import type { Match } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

// SSR-safe chart import
const OddsHistoryChart = dynamic(
  () =>
    import("@/components/odds-comparison/odds-history-chart").then(
      (m) => m.OddsHistoryChart
    ),
  { ssr: false, loading: () => <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">Loading chart...</div> }
);

// ── Simulated bookmaker odds spread ───────────────────────────────────────
// For a selected match, generate per-bookmaker odds with small random-looking
// variations derived from the base odds deterministically (no Math.random).

function deriveBookmakerOdds(
  base: number,
  bookmakerIndex: number,
  direction: number // +1 or -1
): number {
  const offsets = [0, 0.05, -0.03, 0.08, -0.06, 0.04, -0.04, 0.07];
  const raw = base + offsets[bookmakerIndex % offsets.length] * direction;
  return Math.max(1.01, Math.round(raw * 100) / 100);
}

function getSpreadOdds(match: Match) {
  return bookmakers.map((bk, i) => {
    const home1x2 = deriveBookmakerOdds(match.odds.home.decimal, i, 1);
    const draw1x2 = deriveBookmakerOdds(match.odds.draw.decimal, i, -1);
    const away1x2 = deriveBookmakerOdds(match.odds.away.decimal, i, 1);
    const margin1x2 =
      ((1 / home1x2 + 1 / draw1x2 + 1 / away1x2 - 1) * 100);

    const baseOver = match.overUnder?.over.decimal ?? 1.8;
    const baseUnder = match.overUnder?.under.decimal ?? 2.0;
    const over = deriveBookmakerOdds(baseOver, i, 1);
    const under = deriveBookmakerOdds(baseUnder, i, -1);

    const baseBttsYes = match.btts?.yes.decimal ?? 1.7;
    const baseBttsNo = match.btts?.no.decimal ?? 2.1;
    const bttsYes = deriveBookmakerOdds(baseBttsYes, i, 1);
    const bttsNo = deriveBookmakerOdds(baseBttsNo, i, -1);

    return {
      bookmaker: bk,
      home1x2,
      draw1x2,
      away1x2,
      margin1x2: Math.round(margin1x2 * 10) / 10,
      over,
      under,
      bttsYes,
      bttsNo,
    };
  });
}

// ── Best odds finders ─────────────────────────────────────────────────────

function findBest<T extends object>(rows: T[], key: keyof T): number {
  const vals = rows.map((r) => r[key] as number);
  return Math.max(...vals);
}

function findBestMargin<T extends { margin1x2: number }>(rows: T[]): number {
  return Math.min(...rows.map((r) => r.margin1x2));
}

// ── Odds Cell with highlight ──────────────────────────────────────────────

function OddsCell({ value, isBest }: { value: number; isBest: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-sm tabular-nums",
        isBest
          ? "text-[color:var(--success)] font-semibold"
          : "text-foreground"
      )}
    >
      {isBest && <span className="mr-0.5 text-[10px]">★</span>}
      {value.toFixed(2)}
    </span>
  );
}

// ── Margin Cell ───────────────────────────────────────────────────────────

function MarginCell({ margin, isBest }: { margin: number; isBest: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-sm tabular-nums",
        isBest
          ? "text-[color:var(--success)] font-semibold"
          : margin > 5 ? "text-destructive" : "text-[color:var(--warning)]"
      )}
    >
      {margin.toFixed(1)}%
      {isBest && <span className="ml-1 text-[10px]">best</span>}
    </span>
  );
}

// ── Movement Summary ──────────────────────────────────────────────────────

function MovementSummary({ match }: { match: Match }) {
  const items = [
    { label: "Home", value: match.odds.home.decimal, movement: match.odds.home.movement, prev: match.odds.home.previousDecimal },
    { label: "Draw", value: match.odds.draw.decimal, movement: match.odds.draw.movement, prev: match.odds.draw.previousDecimal },
    { label: "Away", value: match.odds.away.decimal, movement: match.odds.away.movement, prev: match.odds.away.previousDecimal },
  ];
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {items.map(({ label, value, movement, prev }) => (
        <div key={label} className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground text-xs">{label}</span>
          <span className="font-mono font-semibold">{value.toFixed(2)}</span>
          {movement === "up" && <TrendingUp className="w-3.5 h-3.5 text-[color:var(--success)]" />}
          {movement === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
          {movement === "stable" && <Minus className="w-3.5 h-3.5 text-muted-foreground/40" />}
          {prev && (
            <span className="text-xs text-muted-foreground/50 font-mono line-through">
              {prev.toFixed(2)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function OddsComparisonPage() {
  const featuredMatches = useMemo(
    () => matches.filter((m) => m.status !== "finished"),
    []
  );

  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    featuredMatches[0]?.id ?? matches[0].id
  );

  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) ?? matches[0],
    [selectedMatchId]
  );

  const spreadOdds = useMemo(() => getSpreadOdds(selectedMatch), [selectedMatch]);

  // Best 1X2 odds
  const bestHome = findBest(spreadOdds, "home1x2");
  const bestDraw = findBest(spreadOdds, "draw1x2");
  const bestAway = findBest(spreadOdds, "away1x2");
  const bestMargin1x2 = findBestMargin(spreadOdds);
  // Best O/U
  const bestOver = findBest(spreadOdds, "over");
  const bestUnder = findBest(spreadOdds, "under");
  // Best BTTS
  const bestBttsYes = findBest(spreadOdds, "bttsYes");
  const bestBttsNo = findBest(spreadOdds, "bttsNo");

  const isLive =
    selectedMatch.status === "live" || selectedMatch.status === "half-time";

  return (
    <div className="space-y-6" style={{ padding: "var(--content-padding, 1.5rem)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Odds Comparison</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare best available odds across {bookmakers.length} integrated bookmakers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{bookmakers.length} bookmakers</span>
        </div>
      </div>

      {/* Match selector */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding, 1.5rem)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
              Select Fixture
            </label>
            <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {featuredMatches.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <span className="font-medium">
                      {m.homeTeam.shortName} vs {m.awayTeam.shortName}
                    </span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      {m.leagueName}
                    </span>
                    {(m.status === "live" || m.status === "half-time") && (
                      <span className="ml-2 text-[color:var(--success)] text-xs">● LIVE</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1.5">
              Current Market
            </p>
            <MovementSummary match={selectedMatch} />
          </div>
          {isLive && (
            <Badge
              variant="outline"
              className="text-xs text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20 rounded-full self-start sm:self-center shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] mr-1.5 animate-pulse inline-block" />
              LIVE {selectedMatch.minute}&apos;
            </Badge>
          )}
        </div>
      </div>

      {/* Odds comparison tabs */}
      <Tabs defaultValue="1x2">
        <TabsList className="grid w-full max-w-sm grid-cols-3">
          <TabsTrigger value="1x2" className="text-xs">1X2</TabsTrigger>
          <TabsTrigger value="ou" className="text-xs">Over/Under</TabsTrigger>
          <TabsTrigger value="btts" className="text-xs">BTTS</TabsTrigger>
        </TabsList>

        {/* 1X2 Tab */}
        <TabsContent value="1x2" className="mt-4">
          <div className="aesthetic-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                      Bookmaker
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      1 — {selectedMatch.homeTeam.shortName}
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      X — Draw
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      2 — {selectedMatch.awayTeam.shortName}
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      Overround
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spreadOdds.map((row) => (
                    <TableRow
                      key={row.bookmaker.id}
                      className={cn(
                        "hover:bg-[color:var(--surface-hover)] transition-colors duration-100",
                        row.margin1x2 === bestMargin1x2 &&
                          "bg-[color:var(--success)]/3"
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                            <span className="text-[10px] font-bold">
                              {row.bookmaker.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-sm">
                            {row.bookmaker.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.home1x2}
                          isBest={row.home1x2 === bestHome}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.draw1x2}
                          isBest={row.draw1x2 === bestDraw}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.away1x2}
                          isBest={row.away1x2 === bestAway}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <MarginCell
                          margin={row.margin1x2}
                          isBest={row.margin1x2 === bestMargin1x2}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-[color:var(--success)]">★</span> = best available odds for each outcome
          </p>
        </TabsContent>

        {/* Over/Under Tab */}
        <TabsContent value="ou" className="mt-4">
          <div className="aesthetic-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                      Bookmaker
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      Over {selectedMatch.overUnder?.line ?? 2.5}
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      Under {selectedMatch.overUnder?.line ?? 2.5}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spreadOdds.map((row) => (
                    <TableRow
                      key={row.bookmaker.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                            <span className="text-[10px] font-bold">
                              {row.bookmaker.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-sm">
                            {row.bookmaker.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.over}
                          isBest={row.over === bestOver}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.under}
                          isBest={row.under === bestUnder}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {!selectedMatch.overUnder && (
            <p className="text-xs text-muted-foreground mt-2">
              Over/Under market not available for this fixture.
            </p>
          )}
        </TabsContent>

        {/* BTTS Tab */}
        <TabsContent value="btts" className="mt-4">
          <div className="aesthetic-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                      Bookmaker
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      Both Teams Score — Yes
                    </TableHead>
                    <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                      Both Teams Score — No
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spreadOdds.map((row) => (
                    <TableRow
                      key={row.bookmaker.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                            <span className="text-[10px] font-bold">
                              {row.bookmaker.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-sm">
                            {row.bookmaker.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.bttsYes}
                          isBest={row.bttsYes === bestBttsYes}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <OddsCell
                          value={row.bttsNo}
                          isBest={row.bttsNo === bestBttsNo}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {!selectedMatch.btts && (
            <p className="text-xs text-muted-foreground mt-2">
              BTTS market not available for this fixture.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Odds history chart */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding, 1.5rem)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">1X2 Price History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              7-day movement — {selectedMatch.homeTeam.shortName} vs {selectedMatch.awayTeam.shortName}
            </p>
          </div>
          <Badge variant="outline" className="text-xs rounded-full text-muted-foreground">
            Last 7 days
          </Badge>
        </div>
        <OddsHistoryChart />
      </div>
    </div>
  );
}
