import { TrendingUp, ExternalLink } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";

const stats = [
  { value: "24+", label: "Projects Shipped" },
  { value: "< 48hr", label: "Demo Turnaround" },
  { value: "15+", label: "Industries Served" },
];

const approachTimelines = [
  "Week 1",
  "Week 1–2",
  "Week 2–3",
  "Week 4",
];

export default function ProposalPage() {
  const projectName = APP_CONFIG.projectName;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">

      {/* ── Section 1: Hero ──────────────────────────────────────── */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "oklch(0.06 0.02 var(--primary-h, 145))" }}
      >
        {/* Subtle radial green highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.72 0.22 145 / 0.12), transparent 70%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-12 space-y-6">
          {/* Effort badge — mandatory */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white/80 px-3 py-1 rounded-full">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Built this demo for your project
          </span>

          {/* Role prefix */}
          <p className="font-mono text-xs tracking-widest uppercase text-white/40">
            Full-Stack Developer · React Native Specialist
          </p>

          {/* Weight contrast headline */}
          <h1 className="text-5xl md:text-6xl tracking-tight leading-none">
            <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
            <span className="font-black text-white">{profile.name}</span>
          </h1>

          {/* Tailored value prop */}
          <p className="text-lg md:text-xl text-white/65 max-w-2xl leading-relaxed">
            I build real-time mobile apps with live odds feeds, snappy UI, and clean API integration — and I&apos;ve already built a working {projectName} demo for your review in Tab 1.
          </p>
        </div>

        {/* Stats shelf */}
        <div
          className="relative z-10 border-t px-8 py-4"
          style={{
            borderColor: "oklch(1 0 0 / 0.08)",
            background: "oklch(1 0 0 / 0.04)",
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl font-bold"
                  style={{
                    background:
                      "linear-gradient(to right, oklch(0.92 0 0), oklch(0.70 0.22 145))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Proof of Work ─────────────────────────────── */}
      <section className="space-y-4">
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          Proof of Work
        </p>
        <h2 className="text-2xl font-bold tracking-tight">Relevant Projects</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {portfolioProjects.map((project) => (
            <div key={project.id} className="aesthetic-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug">
                  {project.title}
                </h3>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                    style={{ transitionDuration: "var(--dur-fast)" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Outcome — always present */}
              {project.outcome && (
                <div className="flex items-start gap-2 text-sm text-[color:var(--success)]">
                  <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{project.outcome}</span>
                </div>
              )}

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-primary/10 text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Relevance note */}
              {project.relevance && (
                <p className="text-xs text-primary/60 italic leading-relaxed">
                  {project.relevance}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work ─────────────────────────────────── */}
      <section className="space-y-4">
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          Process
        </p>
        <h2 className="text-2xl font-bold tracking-tight">How I Work</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {profile.approach.map((step, i) => (
            <div key={step.title} className="aesthetic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-muted-foreground/50">
                  {approachTimelines[i]}
                </span>
              </div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Skills Grid ───────────────────────────────── */}
      <section className="space-y-4">
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          Tech Stack
        </p>
        <h2 className="text-2xl font-bold tracking-tight">What I Build With</h2>

        <div className="space-y-3">
          {profile.skillCategories.map((category) => (
            <div key={category.name} className="aesthetic-card p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {category.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md border text-sm font-mono text-foreground/70 bg-muted/30"
                    style={{ borderColor: "oklch(1 0 0 / 0.1)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ──────────────────────────────────────── */}
      <section
        className="relative rounded-2xl overflow-hidden text-center"
        style={{ background: "oklch(0.06 0.02 var(--primary-h, 145))" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 100%, oklch(0.72 0.22 145 / 0.10), transparent 70%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-12 space-y-4">
          {/* Pulsing availability indicator */}
          <div className="flex items-center justify-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[color:var(--success)]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span
              className="text-sm"
              style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
            >
              Currently available for new projects
            </span>
          </div>

          {/* Headline — tailored to this project */}
          <h2 className="text-2xl font-bold text-white">
            Ready to ship your {projectName} in weeks, not months.
          </h2>

          {/* Body — references the demo */}
          <p className="text-white/65 max-w-lg mx-auto leading-relaxed">
            The demo in Tab 1 shows the odds display, live update cadence, and filtering logic already working. The real app adds the Odds API integration, Expo build pipeline, and cross-platform parity — and I can start this week.
          </p>

          {/* Primary action — text, not a dead-end button */}
          <p className="text-lg font-semibold text-white pt-2">
            Reply on Upwork to start
          </p>

          {/* Secondary link back to demo */}
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            ← Back to the demo
          </a>

          {/* Signature */}
          <p
            className="pt-4 text-sm text-white/35"
            style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)", marginTop: "1rem" }}
          >
            — Humam
          </p>
        </div>
      </section>

    </div>
  );
}
