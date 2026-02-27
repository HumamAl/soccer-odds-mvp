"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { bookmakers } from "@/data/mock-data";
import type { Bookmaker } from "@/lib/types";
import { Star, ChevronUp, ChevronDown, TrendingDown } from "lucide-react";

// ── Star Rating ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < full
              ? "fill-[color:var(--warning)] text-[color:var(--warning)]"
              : i === full && hasHalf
              ? "fill-[color:var(--warning)]/40 text-[color:var(--warning)]"
              : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
      <span className="ml-1.5 text-xs text-muted-foreground font-mono">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ── Margin Quality Badge ───────────────────────────────────────────────────

function MarginBadge({ margin }: { margin: number }) {
  if (margin <= 2.5) {
    return (
      <Badge
        variant="outline"
        className="text-xs rounded-full text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20"
      >
        Excellent
      </Badge>
    );
  }
  if (margin <= 4.0) {
    return (
      <Badge
        variant="outline"
        className="text-xs rounded-full text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20"
      >
        Good
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-xs rounded-full text-destructive bg-destructive/10 border-destructive/20"
    >
      High
    </Badge>
  );
}

// ── Last Updated Formatter ─────────────────────────────────────────────────

function formatUpdated(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

// ── Sort Types ────────────────────────────────────────────────────────────

type SortKey = keyof Pick<Bookmaker, "name" | "avgMargin" | "matchesCovered" | "rating">;
type SortDir = "asc" | "desc";

// ── Page ──────────────────────────────────────────────────────────────────

export default function BookmakersPage() {
  const [sortKey, setSortKey] = useState<SortKey>("avgMargin");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const maxMargin = Math.max(...bookmakers.map((b) => b.avgMargin));
  const maxMatches = Math.max(...bookmakers.map((b) => b.matchesCovered));

  const sorted = useMemo(() => {
    return [...bookmakers].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        const cmp = av.localeCompare(bv);
        return sortDir === "asc" ? cmp : -cmp;
      }
      const cmp = (av as number) - (bv as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "avgMargin" ? "asc" : "desc"); // margin: lowest first by default
    }
  }

  const bestMargin = Math.min(...bookmakers.map((b) => b.avgMargin));
  const bestBookmaker = bookmakers.find((b) => b.avgMargin === bestMargin);

  const columns: { key: SortKey; label: string; note?: string }[] = [
    { key: "name", label: "Bookmaker" },
    { key: "avgMargin", label: "Avg Margin %", note: "Lower = better for bettors" },
    { key: "matchesCovered", label: "Fixtures Covered" },
    { key: "rating", label: "Rating" },
  ];

  return (
    <div className="space-y-6" style={{ padding: "var(--content-padding, 1.5rem)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookmaker Margins</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare overround margins across all integrated bookmakers — lower margin means better value
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingDown className="w-4 h-4 text-[color:var(--success)]" />
          <span>Sorted by margin (ascending)</span>
        </div>
      </div>

      {/* Best value callout */}
      {bestBookmaker && (
        <div
          className="aesthetic-card flex items-center gap-4"
          style={{ padding: "var(--card-padding-sm, 1rem)" }}
        >
          <div className="w-10 h-10 rounded-lg bg-[color:var(--success)]/10 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-[color:var(--success)]" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              Best value: {bestBookmaker.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lowest average overround at{" "}
              <span className="font-mono text-[color:var(--success)] font-semibold">
                {bestBookmaker.avgMargin.toFixed(1)}%
              </span>{" "}
              margin — covering{" "}
              <span className="font-mono">{bestBookmaker.matchesCovered}</span> fixtures
            </p>
          </div>
        </div>
      )}

      {/* Bookmakers table */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground w-8 text-center">
                  #
                </TableHead>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      <div>
                        {col.label}
                        {col.note && (
                          <p className="text-[10px] font-normal text-muted-foreground/60 mt-0.5 hidden lg:block">
                            {col.note}
                          </p>
                        )}
                      </div>
                      {sortKey === col.key && (
                        sortDir === "asc"
                          ? <ChevronUp className="w-3 h-3 shrink-0" />
                          : <ChevronDown className="w-3 h-3 shrink-0" />
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground min-w-[160px]">
                  Margin Visualized
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Value Tier
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Last Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((bk, index) => {
                const isBest = bk.avgMargin === bestMargin;
                return (
                  <TableRow
                    key={bk.id}
                    className={cn(
                      "hover:bg-[color:var(--surface-hover)] transition-colors duration-100",
                      isBest && "bg-[color:var(--success)]/3"
                    )}
                  >
                    <TableCell className="text-center text-xs text-muted-foreground font-mono">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                          <span className="text-xs font-bold text-foreground">
                            {bk.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-sm">{bk.name}</span>
                        {isBest && (
                          <Badge
                            variant="outline"
                            className="text-[10px] rounded-full text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20 px-1.5 py-0"
                          >
                            Best
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-mono text-sm font-semibold tabular-nums",
                          bk.avgMargin <= 2.5 && "text-[color:var(--success)]",
                          bk.avgMargin > 2.5 && bk.avgMargin <= 4.0 && "text-[color:var(--warning)]",
                          bk.avgMargin > 4.0 && "text-destructive"
                        )}
                      >
                        {bk.avgMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm tabular-nums text-foreground">
                        {bk.matchesCovered.toLocaleString()}
                      </span>
                      <div className="mt-1">
                        <Progress
                          value={(bk.matchesCovered / maxMatches) * 100}
                          className="h-1 w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={bk.rating} />
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(bk.avgMargin / maxMargin) * 100}
                          className={cn(
                            "h-2 flex-1",
                            bk.avgMargin <= 2.5
                              ? "[&>div]:bg-[color:var(--success)]"
                              : bk.avgMargin <= 4.0
                              ? "[&>div]:bg-[color:var(--warning)]"
                              : "[&>div]:bg-destructive"
                          )}
                        />
                        <span className="text-xs text-muted-foreground font-mono w-8 text-right">
                          {((bk.avgMargin / maxMargin) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <MarginBadge margin={bk.avgMargin} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {formatUpdated(bk.lastUpdated)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Overround (margin) represents the bookmaker&apos;s built-in edge. A 2% margin means bettors collectively return 98p per £1 wagered. Lower margins indicate sharper, more efficient pricing.
      </p>
    </div>
  );
}
