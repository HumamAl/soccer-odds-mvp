import type { LucideIcon } from "lucide-react";

// Sidebar navigation
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ── Match & Odds Domain Types ─────────────────────────────────────

export type MatchStatus = "upcoming" | "live" | "half-time" | "finished" | "postponed" | "suspended";

export type OddsMovement = "up" | "down" | "stable";

export type MarketType = "1x2" | "over-under" | "btts" | "asian-handicap" | "correct-score" | "double-chance";

export interface League {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  logoEmoji: string; // flag emoji
  matchCount: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  leagueId: string;
}

export interface OddsValue {
  decimal: number;
  movement: OddsMovement;
  previousDecimal?: number;
  bookmaker: string;
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatus;
  kickoff: string; // ISO datetime
  minute?: number; // current minute if live
  homeScore?: number;
  awayScore?: number;
  odds: {
    home: OddsValue;
    draw: OddsValue;
    away: OddsValue;
  };
  overUnder?: {
    line: number; // e.g., 2.5
    over: OddsValue;
    under: OddsValue;
  };
  btts?: {
    yes: OddsValue;
    no: OddsValue;
  };
  isFeatured?: boolean;
}

export interface Bookmaker {
  id: string;
  name: string;
  avgMargin: number; // percentage
  matchesCovered: number;
  rating: number; // 1-5
  lastUpdated: string;
}

export interface OddsHistoryPoint {
  timestamp: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

// ── Dashboard Stats ───────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

// ── Monthly API Usage (chart data) ───────────────────────────────

export interface ApiUsagePoint {
  month: string;
  requests: number;
  latency: number; // avg ms
}

// ── Market Distribution ──────────────────────────────────────────

export interface MarketDistribution {
  market: string;
  percentage: number;
  count: number;
}

// Challenge visualization types
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// Proposal types
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}
