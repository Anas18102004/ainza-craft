import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Database,
  ShieldCheck,
  Workflow,
  FileSearch,
  Bot,
  TrendingUp,
  Lock,
  Check,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/ai-systems")({
  head: () => ({
    meta: [
      { title: "AI Systems — AINZA" },
      { name: "description", content: "Intelligent tools and workflow automation designed around real business operations." },
      { property: "og:title", content: "AI Systems — AINZA" },
      { property: "og:description", content: "AI built around real operations, not novelty." },
    ],
  }),
  component: AiSystemsPage,
});

const USE_CASES = [
  {
    icon: FileSearch,
    title: "Document understanding",
    body: "Extract structured data from contracts, invoices, and operational paperwork — with confidence scores and human review for low-confidence items.",
    tags: ["RAG", "OCR", "Human review"],
  },
  {
    icon: Bot,
    title: "Internal copilots",
    body: "Role-aware assistants that answer over your own knowledge base, SOPs, and systems — with citations, access control, and audit logs.",
    tags: ["RAG", "RBAC", "Audit"],
  },
  {
    icon: Workflow,
    title: "Operational automation",
    body: "Trigger-based workflows that combine deterministic rules and model calls — orchestrated, observable, and safe to roll back.",
    tags: ["Orchestration", "Evals", "Rollback"],
  },
  {
    icon: TrendingUp,
    title: "Forecasting & anomaly detection",
    body: "Demand, inventory, and operational anomaly models — surfaced inside the tools your team already uses, not a separate dashboard.",
    tags: ["Time series", "Monitoring", "Alerts"],
  },
];

const PRINCIPLES = [
  { icon: ShieldCheck, k: "Security by design", v: "Data isolation, encryption in transit and at rest, no training on your data without consent." },
  { icon: Lock, k: "Access & audit", v: "Role-based access, full request logs, and per-action audit trails for sensitive workflows." },
  { icon: Check, k: "Evaluated, not assumed", v: "Every system ships with offline evals, online quality monitoring, and a clear failure mode." },
  { icon: Database, k: "Compliance-aligned", v: "Architectures aligned with GDPR principles, ISO 27001 controls, and OWASP guidance." },
];

function AiSystemsPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Systems"
        title="AI built around real operations — secure, evaluated, and owned by your team."
        blurb="We design AI systems the same way we design any production software: with clear inputs, clear outputs, observability, security controls, and a defined human-in-the-loop. Not demos. Systems."
      />

      {/* System architecture diagram */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-12">
        <Reveal>
          <p className="label-eyebrow">Reference architecture</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">
            A predictable, auditable path from input to action.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <ArchitectureDiagram />
        </Reveal>
      </section>

      {/* Use cases */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-16">
        <Reveal>
          <p className="label-eyebrow">Use cases</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">
            Where AINZA's AI systems earn their keep.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.05}>
              <article className="glass h-full rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-violet">
                    <u.icon size={18} />
                  </span>
                  <h3 className="font-display text-[17px] font-semibold">{u.title}</h3>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{u.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {u.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Security & compliance */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="label-eyebrow">Security & compliance</p>
              <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                AI you can put in front of your data without losing sleep.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
                Every AINZA AI system is built on four non-negotiable principles. We document them, implement them, and review them with you before launch.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <ul className="grid gap-3">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.k} delay={i * 0.05}>
                  <li className="glass flex gap-4 rounded-2xl p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-cyan">
                      <p.icon size={18} />
                    </span>
                    <div>
                      <div className="font-display text-[15.5px] font-semibold">{p.k}</div>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{p.v}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] pb-28 pt-8">
        <Reveal>
          <div className="glass-strong animated-border relative overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -inset-20 -z-10 bg-radial-spot opacity-80" />
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="label-eyebrow">Scope an AI system</p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                  Bring us the workflow — we'll bring the architecture.
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Discovery, threat model, and a delivery plan inside two weeks.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Talk to AINZA <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.06]"
                >
                  Full services
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pt-40">
      <div className="absolute inset-0 -z-10 bg-radial-spot opacity-90" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.18]" />
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal>
          <p className="label-eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-gradient-brand">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{blurb}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Architecture diagram (CSS + SVG, themed) ---------- */

function ArchitectureDiagram() {
  const nodes: {
    label: string;
    sub: string;
    icon: typeof Brain;
    col: 1 | 2 | 3 | 4;
    accent: "violet" | "blue" | "cyan";
  }[] = [
    { label: "Inputs", sub: "Docs · Events · Users", icon: FileSearch, col: 1, accent: "violet" },
    { label: "Retrieval", sub: "Vector + structured", icon: Database, col: 2, accent: "blue" },
    { label: "Reasoning", sub: "LLM + tools + rules", icon: Brain, col: 3, accent: "violet" },
    { label: "Action", sub: "Write-back · Workflow", icon: Workflow, col: 4, accent: "cyan" },
  ];
  const guardrails: { label: string; icon: typeof Brain }[] = [
    { label: "Access control", icon: Lock },
    { label: "Evaluation & monitoring", icon: Check },
    { label: "Audit & logging", icon: ShieldCheck },
  ];

  const accent = {
    violet: "text-violet",
    blue: "text-blue",
    cyan: "text-cyan",
  } as const;

  return (
    <div className="glass animated-border relative mt-8 overflow-hidden rounded-3xl p-6 md:p-10">
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute -inset-20 -z-10 bg-radial-spot opacity-70" />

      {/* Pipeline row */}
      <div className="relative">
        {/* connector line */}
        <div className="pointer-events-none absolute left-6 right-6 top-12 hidden h-px bg-gradient-to-r from-violet/40 via-blue/40 to-cyan/40 md:block" />
        <div className="grid gap-4 md:grid-cols-4">
          {nodes.map((n, i) => (
            <div key={n.label} className="relative">
              <div className="glass-strong relative z-10 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <span className={`grid h-8 w-8 place-items-center rounded-lg border border-white/12 bg-white/[0.05] ${accent[n.accent]}`}>
                    <n.icon size={15} />
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-dim">
                    step 0{i + 1}
                  </span>
                </div>
                <div className="mt-3 font-display text-[15.5px] font-semibold">{n.label}</div>
                <div className="text-[12.5px] text-muted-foreground">{n.sub}</div>
              </div>
              {/* arrow between nodes (desktop) */}
              {i < nodes.length - 1 && (
                <ArrowRight
                  size={16}
                  className="absolute -right-2 top-10 z-20 hidden text-foreground/40 md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guardrails row */}
      <div className="mt-8">
        <p className="label-eyebrow">Cross-cutting guardrails</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {guardrails.map((g) => (
            <div
              key={g.label}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-cyan">
                <g.icon size={13} />
              </span>
              <span className="text-[13.5px] text-foreground/90">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}