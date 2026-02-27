import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "Full-stack developer who ships MVPs fast — from concept to deployed product in days, not months.",
  bio: "I build MVPs and production apps that solve real operational problems — data-driven dashboards, real-time apps, and API-heavy platforms. My approach is straightforward: understand the business need, build something that works, and ship it fast.",
  approach: [
    {
      title: "Map the Odds API",
      description:
        "Understand the data model, rate limits, and WebSocket endpoints before writing a line of React Native. The right API strategy avoids rewrite risk later.",
    },
    {
      title: "Build the Core Screens",
      description:
        "Match listing, live odds view, and odds comparison — the three screens users will live in. Working code from day one, visible progress every few days.",
    },
    {
      title: "Optimize for Performance",
      description:
        "Virtualized lists, memoized odds cells, and batched state updates for smooth 60fps scrolling even with hundreds of live odds updating simultaneously.",
    },
    {
      title: "Ship to TestFlight & Play Store",
      description:
        "CI/CD pipeline with Expo EAS for automated builds and OTA updates. You get a production-ready app with a repeatable release process from day one.",
    },
  ],
  skillCategories: [
    {
      name: "Mobile & Frontend",
      skills: [
        "React Native",
        "TypeScript",
        "Expo",
        "React Navigation",
        "Reanimated",
      ],
    },
    {
      name: "APIs & Real-Time",
      skills: [
        "REST APIs",
        "WebSockets",
        "Firebase RTDB",
        "Odds API Integration",
      ],
    },
    {
      name: "Backend & DevOps",
      skills: [
        "Node.js",
        "Firebase",
        "Expo EAS",
        "GitHub Actions",
        "Vercel",
      ],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "sports-vision",
    title: "Sports Vision MVP",
    description:
      "Real-time sports object detection web demo simulating an iOS AR/LiDAR scanning experience — scan UI, detection overlays, confidence scores, accuracy visualization.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
    outcome:
      "AR-style scan UI with detection overlays, confidence scores, and accuracy visualization — delivered as a browser-based MVP",
    relevance: "Sports tech domain match — fast MVP delivery with real-time visual feedback",
  },
  {
    id: "ebay-monitor",
    title: "eBay Pokemon Monitor",
    description:
      "Real-time listing monitor using the eBay Browse API — instant Discord webhook alerts when matching listings appear, with price trend tracking over time.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    outcome:
      "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
    liveUrl: "https://ebay-pokemon-monitor.vercel.app",
    relevance: "Closest analogue to the Odds API integration pattern — poll, detect change, push update",
  },
  {
    id: "data-intelligence",
    title: "Data Intelligence Platform",
    description:
      "Analytics dashboard pulling data from multiple sources with interactive charts, filterable insights, and multi-source aggregation — built for fast exploration of live data.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
    outcome:
      "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
    relevance: "Odds dashboards are data-dense — same filtering and chart patterns apply directly",
  },
  {
    id: "fleet-saas",
    title: "Fleet Maintenance SaaS",
    description:
      "Six-module SaaS covering asset tracking, work orders, preventive maintenance scheduling, inspections, parts inventory, and analytics — demonstrating full multi-module app architecture.",
    tech: ["Next.js", "TypeScript", "Recharts", "shadcn/ui"],
    outcome:
      "6-module SaaS covering the full maintenance lifecycle — from asset registry to work orders to parts inventory",
    relevance: "Demonstrates ability to architect a complex multi-screen app with relational data",
  },
];
