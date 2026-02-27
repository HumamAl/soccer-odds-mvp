import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most React Native developers wire up a third-party odds API and poll it on an interval — cheap to build, brutal in production. You get stale lines, missed price movements, and battery-draining requests that kill app store reviews.",
  differentApproach:
    "I'd build a WebSocket-first sync layer with diff-based state reconciliation, virtualized odds tables, and a resilient cache fallback — so the app stays fast, live, and reliable even when the API has a bad moment.",
  accentWord: "WebSocket-first",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Real-Time Odds Synchronization Without UI Jank",
    description:
      "The Odds API emits hundreds of price updates per minute across concurrent matches. Naively applying every update to React state causes layout thrashing, missed frames, and a UI that feels unreliable — exactly what bettors can't trust.",
    visualizationType: "flow",
    outcome:
      "Could maintain sub-100ms odds update latency with batched state reconciliation, keeping the UI at 60fps even during high-volume Premier League match windows.",
  },
  {
    id: "challenge-2",
    title: "Cross-Platform Performance on iOS and Android",
    description:
      "React Native shares JavaScript logic but diverges on rendering. iOS uses Metal-backed views while Android falls back to slower bridge calls. A data-dense odds table that feels smooth on iPhone can stutter on mid-range Android.",
    visualizationType: "before-after",
    outcome:
      "Could deliver consistent 60fps scrolling on both platforms using virtualized FlatList with memoized odds cells and platform-conditional animation budgets.",
  },
  {
    id: "challenge-3",
    title: "API Resilience and Graceful Degradation",
    description:
      "Third-party odds providers enforce rate limits, return inconsistent field shapes between sports, and occasionally go dark during peak traffic. The app needs to handle all of this invisibly — bettors can't see a spinner when odds are moving.",
    visualizationType: "architecture",
    outcome:
      "Could achieve 99.5%+ uptime perception with a Firebase RT DB cache layer, stale-data age indicators, and exponential-backoff retry logic — users always see the last known line, never a blank screen.",
  },
];
