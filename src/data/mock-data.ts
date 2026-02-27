import type {
  League,
  Match,
  Bookmaker,
  OddsHistoryPoint,
  DashboardStat,
  ApiUsagePoint,
  MarketDistribution,
} from "@/lib/types";

// ── Leagues ──────────────────────────────────────────────────────

export const leagues: League[] = [
  { id: "epl", name: "Premier League", country: "England", countryCode: "GB", logoEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", matchCount: 8 },
  { id: "laliga", name: "La Liga", country: "Spain", countryCode: "ES", logoEmoji: "🇪🇸", matchCount: 6 },
  { id: "seriea", name: "Serie A", country: "Italy", countryCode: "IT", logoEmoji: "🇮🇹", matchCount: 5 },
  { id: "bundes", name: "Bundesliga", country: "Germany", countryCode: "DE", logoEmoji: "🇩🇪", matchCount: 5 },
  { id: "ligue1", name: "Ligue 1", country: "France", countryCode: "FR", logoEmoji: "🇫🇷", matchCount: 4 },
  { id: "ucl", name: "Champions League", country: "Europe", countryCode: "EU", logoEmoji: "⭐", matchCount: 4 },
];

// ── Matches ──────────────────────────────────────────────────────

export const matches: Match[] = [
  // Premier League — Live
  {
    id: "m1",
    leagueId: "epl",
    leagueName: "Premier League",
    homeTeam: { id: "t1", name: "Arsenal", shortName: "ARS", leagueId: "epl" },
    awayTeam: { id: "t2", name: "Chelsea", shortName: "CHE", leagueId: "epl" },
    status: "live",
    kickoff: new Date(Date.now() - 55 * 60000).toISOString(),
    minute: 55,
    homeScore: 2,
    awayScore: 1,
    odds: {
      home: { decimal: 1.42, movement: "down", previousDecimal: 1.55, bookmaker: "bet365" },
      draw: { decimal: 4.80, movement: "up", previousDecimal: 4.20, bookmaker: "bet365" },
      away: { decimal: 6.50, movement: "up", previousDecimal: 5.80, bookmaker: "bet365" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.28, movement: "down", bookmaker: "bet365" }, under: { decimal: 3.60, movement: "up", bookmaker: "bet365" } },
    btts: { yes: { decimal: 1.55, movement: "stable", bookmaker: "bet365" }, no: { decimal: 2.30, movement: "stable", bookmaker: "bet365" } },
    isFeatured: true,
  },
  {
    id: "m2",
    leagueId: "epl",
    leagueName: "Premier League",
    homeTeam: { id: "t3", name: "Manchester City", shortName: "MCI", leagueId: "epl" },
    awayTeam: { id: "t4", name: "Liverpool", shortName: "LIV", leagueId: "epl" },
    status: "live",
    kickoff: new Date(Date.now() - 32 * 60000).toISOString(),
    minute: 32,
    homeScore: 1,
    awayScore: 1,
    odds: {
      home: { decimal: 2.20, movement: "up", previousDecimal: 1.90, bookmaker: "Pinnacle" },
      draw: { decimal: 3.40, movement: "down", previousDecimal: 3.80, bookmaker: "Pinnacle" },
      away: { decimal: 3.10, movement: "stable", bookmaker: "Pinnacle" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.65, movement: "down", bookmaker: "Pinnacle" }, under: { decimal: 2.15, movement: "up", bookmaker: "Pinnacle" } },
    btts: { yes: { decimal: 1.40, movement: "down", bookmaker: "Pinnacle" }, no: { decimal: 2.75, movement: "up", bookmaker: "Pinnacle" } },
    isFeatured: true,
  },
  {
    id: "m3",
    leagueId: "epl",
    leagueName: "Premier League",
    homeTeam: { id: "t5", name: "Tottenham", shortName: "TOT", leagueId: "epl" },
    awayTeam: { id: "t6", name: "Manchester United", shortName: "MUN", leagueId: "epl" },
    status: "half-time",
    kickoff: new Date(Date.now() - 50 * 60000).toISOString(),
    minute: 45,
    homeScore: 0,
    awayScore: 0,
    odds: {
      home: { decimal: 2.40, movement: "up", previousDecimal: 2.10, bookmaker: "William Hill" },
      draw: { decimal: 3.10, movement: "down", previousDecimal: 3.50, bookmaker: "William Hill" },
      away: { decimal: 3.20, movement: "stable", bookmaker: "William Hill" },
    },
    overUnder: { line: 2.5, over: { decimal: 2.10, movement: "up", bookmaker: "William Hill" }, under: { decimal: 1.70, movement: "down", bookmaker: "William Hill" } },
  },
  // La Liga — Upcoming
  {
    id: "m4",
    leagueId: "laliga",
    leagueName: "La Liga",
    homeTeam: { id: "t7", name: "Real Madrid", shortName: "RMA", leagueId: "laliga" },
    awayTeam: { id: "t8", name: "Barcelona", shortName: "BAR", leagueId: "laliga" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 3 * 3600000).toISOString(),
    odds: {
      home: { decimal: 2.45, movement: "stable", bookmaker: "Betfair" },
      draw: { decimal: 3.30, movement: "stable", bookmaker: "Betfair" },
      away: { decimal: 2.80, movement: "down", previousDecimal: 2.90, bookmaker: "Betfair" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.80, movement: "stable", bookmaker: "Betfair" }, under: { decimal: 1.95, movement: "stable", bookmaker: "Betfair" } },
    btts: { yes: { decimal: 1.65, movement: "stable", bookmaker: "Betfair" }, no: { decimal: 2.10, movement: "stable", bookmaker: "Betfair" } },
    isFeatured: true,
  },
  {
    id: "m5",
    leagueId: "laliga",
    leagueName: "La Liga",
    homeTeam: { id: "t9", name: "Atletico Madrid", shortName: "ATM", leagueId: "laliga" },
    awayTeam: { id: "t10", name: "Real Sociedad", shortName: "RSO", leagueId: "laliga" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 5 * 3600000).toISOString(),
    odds: {
      home: { decimal: 1.75, movement: "stable", bookmaker: "Unibet" },
      draw: { decimal: 3.60, movement: "stable", bookmaker: "Unibet" },
      away: { decimal: 4.50, movement: "up", previousDecimal: 4.20, bookmaker: "Unibet" },
    },
    overUnder: { line: 2.5, over: { decimal: 2.05, movement: "stable", bookmaker: "Unibet" }, under: { decimal: 1.75, movement: "stable", bookmaker: "Unibet" } },
  },
  // Serie A
  {
    id: "m6",
    leagueId: "seriea",
    leagueName: "Serie A",
    homeTeam: { id: "t11", name: "Inter Milan", shortName: "INT", leagueId: "seriea" },
    awayTeam: { id: "t12", name: "AC Milan", shortName: "ACM", leagueId: "seriea" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 24 * 3600000).toISOString(),
    odds: {
      home: { decimal: 1.85, movement: "down", previousDecimal: 1.95, bookmaker: "bet365" },
      draw: { decimal: 3.50, movement: "stable", bookmaker: "bet365" },
      away: { decimal: 4.00, movement: "up", previousDecimal: 3.80, bookmaker: "bet365" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.90, movement: "stable", bookmaker: "bet365" }, under: { decimal: 1.85, movement: "stable", bookmaker: "bet365" } },
    btts: { yes: { decimal: 1.75, movement: "stable", bookmaker: "bet365" }, no: { decimal: 1.95, movement: "stable", bookmaker: "bet365" } },
  },
  {
    id: "m7",
    leagueId: "seriea",
    leagueName: "Serie A",
    homeTeam: { id: "t13", name: "Juventus", shortName: "JUV", leagueId: "seriea" },
    awayTeam: { id: "t14", name: "Napoli", shortName: "NAP", leagueId: "seriea" },
    status: "finished",
    kickoff: new Date(Date.now() - 4 * 3600000).toISOString(),
    homeScore: 1,
    awayScore: 2,
    odds: {
      home: { decimal: 2.30, movement: "stable", bookmaker: "Pinnacle" },
      draw: { decimal: 3.25, movement: "stable", bookmaker: "Pinnacle" },
      away: { decimal: 3.10, movement: "stable", bookmaker: "Pinnacle" },
    },
  },
  // Bundesliga
  {
    id: "m8",
    leagueId: "bundes",
    leagueName: "Bundesliga",
    homeTeam: { id: "t15", name: "Bayern Munich", shortName: "BAY", leagueId: "bundes" },
    awayTeam: { id: "t16", name: "Borussia Dortmund", shortName: "BVB", leagueId: "bundes" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 48 * 3600000).toISOString(),
    odds: {
      home: { decimal: 1.55, movement: "stable", bookmaker: "Betfair" },
      draw: { decimal: 4.20, movement: "stable", bookmaker: "Betfair" },
      away: { decimal: 5.50, movement: "up", previousDecimal: 5.00, bookmaker: "Betfair" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.50, movement: "down", bookmaker: "Betfair" }, under: { decimal: 2.50, movement: "up", bookmaker: "Betfair" } },
    btts: { yes: { decimal: 1.55, movement: "stable", bookmaker: "Betfair" }, no: { decimal: 2.30, movement: "stable", bookmaker: "Betfair" } },
  },
  {
    id: "m9",
    leagueId: "bundes",
    leagueName: "Bundesliga",
    homeTeam: { id: "t17", name: "RB Leipzig", shortName: "RBL", leagueId: "bundes" },
    awayTeam: { id: "t18", name: "Bayer Leverkusen", shortName: "B04", leagueId: "bundes" },
    status: "live",
    kickoff: new Date(Date.now() - 70 * 60000).toISOString(),
    minute: 70,
    homeScore: 0,
    awayScore: 2,
    odds: {
      home: { decimal: 8.50, movement: "up", previousDecimal: 3.20, bookmaker: "William Hill" },
      draw: { decimal: 5.00, movement: "up", previousDecimal: 3.60, bookmaker: "William Hill" },
      away: { decimal: 1.15, movement: "down", previousDecimal: 2.10, bookmaker: "William Hill" },
    },
  },
  // Ligue 1
  {
    id: "m10",
    leagueId: "ligue1",
    leagueName: "Ligue 1",
    homeTeam: { id: "t19", name: "Paris Saint-Germain", shortName: "PSG", leagueId: "ligue1" },
    awayTeam: { id: "t20", name: "Olympique Marseille", shortName: "OM", leagueId: "ligue1" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 6 * 3600000).toISOString(),
    odds: {
      home: { decimal: 1.35, movement: "stable", bookmaker: "Unibet" },
      draw: { decimal: 5.00, movement: "stable", bookmaker: "Unibet" },
      away: { decimal: 8.00, movement: "stable", bookmaker: "Unibet" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.60, movement: "stable", bookmaker: "Unibet" }, under: { decimal: 2.25, movement: "stable", bookmaker: "Unibet" } },
  },
  // Champions League
  {
    id: "m11",
    leagueId: "ucl",
    leagueName: "Champions League",
    homeTeam: { id: "t1", name: "Arsenal", shortName: "ARS", leagueId: "epl" },
    awayTeam: { id: "t7", name: "Real Madrid", shortName: "RMA", leagueId: "laliga" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 72 * 3600000).toISOString(),
    odds: {
      home: { decimal: 2.90, movement: "down", previousDecimal: 3.10, bookmaker: "Pinnacle" },
      draw: { decimal: 3.30, movement: "stable", bookmaker: "Pinnacle" },
      away: { decimal: 2.40, movement: "up", previousDecimal: 2.30, bookmaker: "Pinnacle" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.85, movement: "stable", bookmaker: "Pinnacle" }, under: { decimal: 1.90, movement: "stable", bookmaker: "Pinnacle" } },
    btts: { yes: { decimal: 1.70, movement: "stable", bookmaker: "Pinnacle" }, no: { decimal: 2.05, movement: "stable", bookmaker: "Pinnacle" } },
    isFeatured: true,
  },
  {
    id: "m12",
    leagueId: "ucl",
    leagueName: "Champions League",
    homeTeam: { id: "t15", name: "Bayern Munich", shortName: "BAY", leagueId: "bundes" },
    awayTeam: { id: "t8", name: "Barcelona", shortName: "BAR", leagueId: "laliga" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 72 * 3600000 + 7200000).toISOString(),
    odds: {
      home: { decimal: 2.10, movement: "stable", bookmaker: "bet365" },
      draw: { decimal: 3.50, movement: "stable", bookmaker: "bet365" },
      away: { decimal: 3.30, movement: "stable", bookmaker: "bet365" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.70, movement: "stable", bookmaker: "bet365" }, under: { decimal: 2.05, movement: "stable", bookmaker: "bet365" } },
  },
  // More Premier League
  {
    id: "m13",
    leagueId: "epl",
    leagueName: "Premier League",
    homeTeam: { id: "t21", name: "Newcastle United", shortName: "NEW", leagueId: "epl" },
    awayTeam: { id: "t22", name: "Aston Villa", shortName: "AVL", leagueId: "epl" },
    status: "upcoming",
    kickoff: new Date(Date.now() + 26 * 3600000).toISOString(),
    odds: {
      home: { decimal: 1.90, movement: "stable", bookmaker: "bet365" },
      draw: { decimal: 3.50, movement: "stable", bookmaker: "bet365" },
      away: { decimal: 4.00, movement: "stable", bookmaker: "bet365" },
    },
    overUnder: { line: 2.5, over: { decimal: 1.85, movement: "stable", bookmaker: "bet365" }, under: { decimal: 1.90, movement: "stable", bookmaker: "bet365" } },
  },
  // Postponed edge case
  {
    id: "m14",
    leagueId: "epl",
    leagueName: "Premier League",
    homeTeam: { id: "t23", name: "West Ham", shortName: "WHU", leagueId: "epl" },
    awayTeam: { id: "t24", name: "Brighton", shortName: "BHA", leagueId: "epl" },
    status: "postponed",
    kickoff: new Date(Date.now() + 2 * 3600000).toISOString(),
    odds: {
      home: { decimal: 2.20, movement: "stable", bookmaker: "Betfair" },
      draw: { decimal: 3.40, movement: "stable", bookmaker: "Betfair" },
      away: { decimal: 3.20, movement: "stable", bookmaker: "Betfair" },
    },
  },
  // Suspended edge case
  {
    id: "m15",
    leagueId: "laliga",
    leagueName: "La Liga",
    homeTeam: { id: "t25", name: "Sevilla", shortName: "SEV", leagueId: "laliga" },
    awayTeam: { id: "t26", name: "Villarreal", shortName: "VIL", leagueId: "laliga" },
    status: "suspended",
    kickoff: new Date(Date.now() - 40 * 60000).toISOString(),
    minute: 38,
    homeScore: 1,
    awayScore: 0,
    odds: {
      home: { decimal: 1.60, movement: "stable", bookmaker: "Unibet" },
      draw: { decimal: 3.80, movement: "stable", bookmaker: "Unibet" },
      away: { decimal: 5.00, movement: "stable", bookmaker: "Unibet" },
    },
  },
  // More finished games
  {
    id: "m16",
    leagueId: "ligue1",
    leagueName: "Ligue 1",
    homeTeam: { id: "t27", name: "Olympique Lyon", shortName: "OL", leagueId: "ligue1" },
    awayTeam: { id: "t28", name: "AS Monaco", shortName: "MON", leagueId: "ligue1" },
    status: "finished",
    kickoff: new Date(Date.now() - 5 * 3600000).toISOString(),
    homeScore: 3,
    awayScore: 3,
    odds: {
      home: { decimal: 2.50, movement: "stable", bookmaker: "Betfair" },
      draw: { decimal: 3.30, movement: "stable", bookmaker: "Betfair" },
      away: { decimal: 2.80, movement: "stable", bookmaker: "Betfair" },
    },
  },
];

// ── Bookmakers ───────────────────────────────────────────────────

export const bookmakers: Bookmaker[] = [
  { id: "bk1", name: "bet365", avgMargin: 4.2, matchesCovered: 342, rating: 4.8, lastUpdated: new Date(Date.now() - 120000).toISOString() },
  { id: "bk2", name: "Pinnacle", avgMargin: 2.1, matchesCovered: 298, rating: 4.9, lastUpdated: new Date(Date.now() - 180000).toISOString() },
  { id: "bk3", name: "Betfair", avgMargin: 3.5, matchesCovered: 315, rating: 4.6, lastUpdated: new Date(Date.now() - 300000).toISOString() },
  { id: "bk4", name: "William Hill", avgMargin: 5.1, matchesCovered: 280, rating: 4.3, lastUpdated: new Date(Date.now() - 240000).toISOString() },
  { id: "bk5", name: "Unibet", avgMargin: 4.8, matchesCovered: 265, rating: 4.4, lastUpdated: new Date(Date.now() - 600000).toISOString() },
  { id: "bk6", name: "DraftKings", avgMargin: 4.5, matchesCovered: 220, rating: 4.2, lastUpdated: new Date(Date.now() - 420000).toISOString() },
  { id: "bk7", name: "FanDuel", avgMargin: 4.7, matchesCovered: 210, rating: 4.1, lastUpdated: new Date(Date.now() - 540000).toISOString() },
  { id: "bk8", name: "888sport", avgMargin: 5.3, matchesCovered: 195, rating: 3.9, lastUpdated: new Date(Date.now() - 780000).toISOString() },
];

// ── Odds History (for Arsenal vs Chelsea match) ──────────────────

export const oddsHistory: OddsHistoryPoint[] = [
  { timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), homeOdds: 1.80, drawOdds: 3.60, awayOdds: 4.20 },
  { timestamp: new Date(Date.now() - 6 * 86400000).toISOString(), homeOdds: 1.75, drawOdds: 3.65, awayOdds: 4.40 },
  { timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), homeOdds: 1.70, drawOdds: 3.70, awayOdds: 4.50 },
  { timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), homeOdds: 1.68, drawOdds: 3.75, awayOdds: 4.60 },
  { timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), homeOdds: 1.65, drawOdds: 3.80, awayOdds: 4.70 },
  { timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), homeOdds: 1.60, drawOdds: 3.90, awayOdds: 4.90 },
  { timestamp: new Date(Date.now() - 86400000).toISOString(), homeOdds: 1.55, drawOdds: 4.00, awayOdds: 5.20 },
  { timestamp: new Date(Date.now() - 43200000).toISOString(), homeOdds: 1.50, drawOdds: 4.10, awayOdds: 5.60 },
  { timestamp: new Date(Date.now() - 7200000).toISOString(), homeOdds: 1.48, drawOdds: 4.20, awayOdds: 5.80 },
  { timestamp: new Date(Date.now() - 3600000).toISOString(), homeOdds: 1.45, drawOdds: 4.50, awayOdds: 6.00 },
  { timestamp: new Date(Date.now() - 1800000).toISOString(), homeOdds: 1.42, drawOdds: 4.80, awayOdds: 6.50 },
];

// ── Dashboard Stats ──────────────────────────────────────────────

export const dashboardStats: DashboardStat[] = [
  { label: "Live Matches", value: "4", change: "+2 from yesterday", trend: "up" },
  { label: "Leagues Tracked", value: "6", change: "All active", trend: "neutral" },
  { label: "Odds Updates / Min", value: "847", change: "+12% vs avg", trend: "up" },
  { label: "Avg API Latency", value: "42ms", change: "-8ms improvement", trend: "down" },
];

// ── API Usage Chart (monthly) ────────────────────────────────────

export const apiUsageData: ApiUsagePoint[] = [
  { month: "Sep", requests: 1240000, latency: 58 },
  { month: "Oct", requests: 1380000, latency: 55 },
  { month: "Nov", requests: 1520000, latency: 52 },
  { month: "Dec", requests: 1680000, latency: 50 },
  { month: "Jan", requests: 1890000, latency: 47 },
  { month: "Feb", requests: 2100000, latency: 42 },
];

// ── Market Distribution ──────────────────────────────────────────

export const marketDistribution: MarketDistribution[] = [
  { market: "1X2 (Moneyline)", percentage: 38, count: 4560 },
  { market: "Over/Under", percentage: 28, count: 3360 },
  { market: "Both Teams to Score", percentage: 15, count: 1800 },
  { market: "Asian Handicap", percentage: 11, count: 1320 },
  { market: "Correct Score", percentage: 8, count: 960 },
];

// ── Helper: Get live matches ─────────────────────────────────────

export function getLiveMatches() {
  return matches.filter((m) => m.status === "live" || m.status === "half-time");
}

export function getUpcomingMatches() {
  return matches.filter((m) => m.status === "upcoming");
}

export function getFinishedMatches() {
  return matches.filter((m) => m.status === "finished");
}

export function getMatchesByLeague(leagueId: string) {
  return matches.filter((m) => m.leagueId === leagueId);
}

export function getFeaturedMatches() {
  return matches.filter((m) => m.isFeatured);
}
