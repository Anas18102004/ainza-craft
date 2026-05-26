import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  ScanSearch,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BrandWordmark } from "@/components/site/BrandWordmark";
import { ServiceIconVisual } from "@/components/site/ServiceIconVisual";
import aiOperationsPlatform from "@/assets/generated/ai-operations-platform.jpg";

export const Route = createFileRoute("/ai-systems")({
  head: () => ({
    meta: [
      { title: "AI Systems - AINZA" },
      {
        name: "description",
        content: "AINZA designs secure, evaluated AI systems for real business operations.",
      },
      { property: "og:title", content: "AI Systems - AINZA" },
      {
        property: "og:description",
        content: "AI built for operations, governance, and production workflows.",
      },
    ],
  }),
  component: AiSystemsPage,
});

const PLATFORM_LAYERS = [
  {
    k: "01",
    title: "Inputs",
    body: "Documents, tickets, databases, messages, events, and human requests enter through controlled connectors.",
  },
  {
    k: "02",
    title: "Retrieval",
    body: "Vector search, structured records, and business rules give every answer the right operating context.",
  },
  {
    k: "03",
    title: "Reasoning",
    body: "Model calls are wrapped with prompts, tools, policies, evals, and deterministic fallbacks.",
  },
  {
    k: "04",
    title: "Actions",
    body: "The system drafts, routes, updates, and escalates work inside the tools your team already uses.",
  },
  {
    k: "05",
    title: "Governance",
    body: "Permissions, data boundaries, redaction, human review, and approval flows are part of the product.",
  },
  {
    k: "06",
    title: "Monitoring",
    body: "Quality, cost, latency, drift, incidents, and user feedback stay visible after launch.",
  },
];

const USE_CASES = [
  {
    title: "Document intelligence",
    body: "Read contracts, invoices, reports, and forms. Extract structured fields, cite source pages, and route uncertain items to review.",
    proof: "Best for legal, finance, procurement, and back-office operations.",
    visual: "ai" as const,
  },
  {
    title: "Internal copilots",
    body: "Role-aware assistants that answer from policies, SOPs, CRM notes, project history, and company knowledge with citations.",
    proof: "Built with identity, permissions, and answer audit trails.",
    visual: "platform" as const,
  },
  {
    title: "Workflow automation",
    body: "Combine rules, model calls, and approval gates to move repetitive work across email, ERP, CRM, ticketing, and custom systems.",
    proof: "Designed for rollback, handoff, and human escalation.",
    visual: "apps" as const,
  },
  {
    title: "Forecasting and anomaly detection",
    body: "Surface demand signals, operational anomalies, inventory risk, and finance exceptions before they become expensive.",
    proof: "Alerts are connected to accountable action, not another passive dashboard.",
    visual: "cloud" as const,
  },
];

const GOVERNANCE = [
  "SSO, role-based access, scoped connectors, and offboarding controls",
  "Audit logs for prompts, responses, tools, approvals, and write-back actions",
  "Data boundaries for sensitive documents, tenants, departments, and regions",
  "Offline evals, online quality checks, regression tests, and human review queues",
  "Clear model routing, cost visibility, incident playbooks, and fallback paths",
];

const METRICS = [
  { value: "28-54%", label: "target cycle-time reduction after workflow fit" },
  { value: "90%+", label: "review coverage for high-risk AI actions" },
  { value: "2-6 wks", label: "typical pilot-to-production scope" },
  { value: "100%", label: "source-cited actions where retrieval is used" },
];

function AiSystemsPage() {
  return (
    <>
      <section className="ai-os-hero relative overflow-hidden pb-[4.5rem] pt-[8.5rem] md:pb-24 md:pt-40">
        <div className="absolute inset-0 -z-10 bg-radial-spot opacity-80" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-[0.16]" />
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0">
            <p className="label-eyebrow">AI Systems</p>
            <h1 className="mt-4 max-w-[350px] text-balance font-display text-[clamp(2.35rem,5vw,4.65rem)] font-semibold leading-[1.01] tracking-tight text-gradient-brand sm:max-w-none">
              AI systems built for operations, not demos.
            </h1>
            <p className="mt-6 max-w-[330px] text-[16px] leading-relaxed text-muted-foreground sm:max-w-2xl md:text-[18px]">
              AINZA turns AI into governed production workflows: connected to company knowledge,
              constrained by access control, measured by evals, and visible to the people
              accountable for outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5"
              >
                Scope an AI system
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/services"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.07]"
              >
                Full services
              </Link>
            </div>
          </div>

          <div className="ai-os-hero-visual animated-border min-w-0">
            <img
              src={aiOperationsPlatform}
              alt="AINZA AI operations platform map with inputs, retrieval, reasoning, actions, governance, and monitoring"
              className="ai-os-hero-image"
              loading="eager"
            />
            <div className="ai-os-hero-status">
              <ServiceIconVisual id="ai" decorative className="h-14 w-14" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  operating layer
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Retrieval, tools, evals, audit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1180px] px-4 py-16 md:py-[5.5rem]">
        <Reveal>
          <p className="label-eyebrow">Platform layers</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.08] tracking-tight">
            The operating model every production AI system needs.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <PlatformMap />
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-[1180px] px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <Reveal>
            <div className="sticky top-28">
              <p className="label-eyebrow">Use cases</p>
              <h2 className="mt-3 font-display text-[clamp(1.65rem,3vw,2.35rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                Where the system earns trust.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
                The strongest AI work starts with a painful workflow and ends with a measurable
                operating change. These are the patterns AINZA scopes most often.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {USE_CASES.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.05}>
                <article className="ai-os-card spotlight-card h-full">
                  <ServiceIconVisual id={u.visual} decorative className="h-[4.5rem] w-[4.5rem]" />
                  <h3 className="mt-5 font-display text-[18px] font-semibold">{u.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
                    {u.body}
                  </p>
                  <p className="mt-5 border-t border-white/[0.08] pt-4 text-[12px] font-medium uppercase tracking-[0.16em] text-foreground/70">
                    {u.proof}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1180px] px-4 py-16">
        <div className="ai-governance-panel animated-border">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div>
                <p className="label-eyebrow">Governance</p>
                <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.65rem)] font-semibold leading-[1.08] tracking-tight">
                  Security, control, and accountability from day one.
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
                  Enterprise AI fails when governance arrives after the demo. AINZA builds access,
                  audit, data boundaries, evals, and human review into the first architecture
                  decision.
                </p>
                <div className="mt-7 grid grid-cols-3 gap-3">
                  <MiniControl icon={LockKeyhole} label="Access" />
                  <MiniControl icon={ScanSearch} label="Audit" />
                  <MiniControl icon={SlidersHorizontal} label="Evals" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="space-y-3">
                {GOVERNANCE.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                  >
                    <Check size={17} className="mt-0.5 shrink-0 text-cyan" />
                    <span className="text-[14.5px] leading-relaxed text-foreground/[0.86]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1180px] px-4 py-16">
        <Reveal>
          <div className="ai-metrics-band">
            {METRICS.map((m, i) => (
              <div key={m.label} className="ai-metric">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  proof 0{i + 1}
                </span>
                <strong>{m.value}</strong>
                <p>{m.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-[1180px] px-4 pb-28 pt-8">
        <Reveal>
          <div className="glass-strong animated-border relative overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -inset-20 -z-10 bg-radial-spot opacity-80" />
            <div className="pointer-events-none absolute right-6 top-6 hidden opacity-[0.18] md:block">
              <BrandWordmark imageClassName="w-[300px]" />
            </div>
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="label-eyebrow">Scope an AI system</p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                  Bring the workflow. We will bring the architecture.
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Discovery, threat model, platform map, and production plan inside a focused first
                  engagement.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Start with AINZA
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.06]"
                >
                  View services
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function PlatformMap() {
  return (
    <div className="ai-platform-map animated-border mt-10">
      <div className="ai-platform-core">
        <ServiceIconVisual id="ai" decorative className="h-24 w-24" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">AINZA OS</p>
          <h3>Production AI loop</h3>
        </div>
      </div>
      <div className="ai-platform-line ai-platform-line-a" />
      <div className="ai-platform-line ai-platform-line-b" />
      <div className="ai-platform-line ai-platform-line-c" />
      <div className="grid gap-3 md:grid-cols-3">
        {PLATFORM_LAYERS.map((layer, i) => (
          <article key={layer.title} className="ai-layer-card">
            <span>{layer.k}</span>
            <h4>{layer.title}</h4>
            <p>{layer.body}</p>
            <div className="ai-layer-pulse" style={{ animationDelay: `${i * 0.18}s` }} />
          </article>
        ))}
      </div>
    </div>
  );
}

function MiniControl({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <Icon size={18} className="text-cyan" />
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground/78">
        {label}
      </p>
    </div>
  );
}
