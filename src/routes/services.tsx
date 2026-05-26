import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  Cloud,
  Compass,
  Check,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AINZA" },
      { name: "description", content: "AI systems, cybersecurity, web & mobile, digital platforms, cloud & DevOps, and strategy from AINZA." },
      { property: "og:title", content: "Services — AINZA" },
      { property: "og:description", content: "Services built around real business needs." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    id: "ai",
    icon: Brain,
    eyebrow: "01 · AI Systems & Automation",
    title: "Intelligent systems that remove operational drag.",
    blurb:
      "We design AI workflows around how your team actually works — not the other way around. From document understanding to internal copilots, every system ships with guardrails, evals, and an owner.",
    deliverables: [
      "Workflow discovery & automation map",
      "Custom LLM pipelines with retrieval & evals",
      "Internal copilots and decision assistants",
      "Human-in-the-loop review interfaces",
      "Model monitoring, cost & quality dashboards",
    ],
    proof: { k: "Avg. cycle-time reduction", v: "35–60%" },
  },
  {
    id: "sec",
    icon: ShieldCheck,
    eyebrow: "02 · Cybersecurity",
    title: "Security designed into the system, not bolted on.",
    blurb:
      "We harden the surfaces that matter — identity, data, APIs, and infrastructure — and give your team a clear, auditable picture of what's protected and why.",
    deliverables: [
      "Threat modelling & architecture review",
      "Identity, access & secrets hardening",
      "Application & API penetration testing",
      "Cloud posture & compliance baselines",
      "Incident response playbooks & drills",
    ],
    proof: { k: "Posture coverage on day one", v: "OWASP · CIS · ISO-aligned" },
  },
  {
    id: "apps",
    icon: Smartphone,
    eyebrow: "03 · Web & Mobile Development",
    title: "Customer-grade products built for real usage.",
    blurb:
      "Performance budgets, accessibility, and design systems are baseline — not extras. We ship React, React Native, and TypeScript apps that hold up under real traffic and real edits.",
    deliverables: [
      "Design systems & component libraries",
      "Responsive web apps (React, TanStack, Next)",
      "Cross-platform mobile (React Native, Expo)",
      "Accessibility (WCAG 2.2 AA) & performance audits",
      "Analytics, A/B and feature-flag instrumentation",
    ],
    proof: { k: "Core Web Vitals", v: "Green on launch" },
  },
  {
    id: "platforms",
    icon: LayoutDashboard,
    eyebrow: "04 · Digital Platforms",
    title: "Operational platforms that scale with your business.",
    blurb:
      "Internal tools, customer portals, and multi-tenant platforms — built on solid domain models with permissions, audit logs, and integrations that don't break in year two.",
    deliverables: [
      "Domain modelling & data architecture",
      "Role-based access, audit & approval flows",
      "Multi-tenant portals & admin consoles",
      "Third-party integrations (CRM, ERP, payments)",
      "Reporting, BI feeds & exports",
    ],
    proof: { k: "Built to scale to", v: "1k+ daily operators" },
  },
  {
    id: "cloud",
    icon: Cloud,
    eyebrow: "05 · Cloud & DevOps",
    title: "Infrastructure your team can actually operate.",
    blurb:
      "Reproducible environments, observable systems, and pipelines your engineers trust. We set up the cloud foundation, then transfer it cleanly to your team.",
    deliverables: [
      "Cloud landing zones (AWS, GCP, Cloudflare)",
      "Infrastructure-as-code (Terraform, Pulumi)",
      "CI/CD pipelines with preview environments",
      "Observability: logs, metrics, traces, alerts",
      "Cost controls & runbooks",
    ],
    proof: { k: "Deploy frequency uplift", v: "Hourly, not weekly" },
  },
  {
    id: "strategy",
    icon: Compass,
    eyebrow: "06 · Strategy & Consulting",
    title: "A clear technology direction, grounded in your P&L.",
    blurb:
      "Short, decisive engagements that translate business goals into a technology roadmap your leadership and engineering team both believe in.",
    deliverables: [
      "Technology & data architecture reviews",
      "Build vs. buy & vendor selection",
      "AI readiness & opportunity mapping",
      "12–24 month delivery roadmaps",
      "Hiring & team structure recommendations",
    ],
    proof: { k: "Typical engagement", v: "2–6 weeks" },
  },
];

const PROCESS = [
  { step: "01", title: "Discover", body: "Operations walkthrough, stakeholder interviews, success metrics." },
  { step: "02", title: "Design", body: "Architecture, security model, UX flows — reviewed and signed off." },
  { step: "03", title: "Build", body: "Iterative delivery in two-week increments with working demos." },
  { step: "04", title: "Launch", body: "Hardening, load tests, documentation, and handover." },
  { step: "05", title: "Support", body: "Long-term partnership: monitoring, evolution, on-call." },
];

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Engineered services for businesses that take technology seriously."
        blurb="Six interlocking practices — covering intelligence, security, product, platform, infrastructure, and strategy — delivered by a senior team that stays with you after launch."
      />

      {/* Capability grid summary */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] pb-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="glass group flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-white/[0.07]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-violet">
                <s.icon size={16} />
              </span>
              <span className="text-[13px] font-medium text-foreground/90">
                {s.eyebrow.split("·")[1]?.trim()}
              </span>
              <ArrowRight size={14} className="ml-auto text-dim transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </section>

      {/* Detailed service sections */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-16">
        <div className="flex flex-col gap-20">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id}>
              <article
                id={s.id}
                className="grid scroll-mt-32 gap-10 md:grid-cols-12 md:gap-12"
              >
                {/* Visual side */}
                <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <ServiceVisual icon={s.icon} index={i} />
                </div>

                {/* Content side */}
                <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <p className="label-eyebrow">{s.eyebrow}</p>
                  <h2 className="mt-3 max-w-xl text-balance font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
                    {s.blurb}
                  </p>

                  <div className="mt-7 grid gap-2 sm:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <div key={d} className="flex items-start gap-2 text-[14px] text-foreground/85">
                        <Check size={14} className="mt-1 shrink-0 text-cyan" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="label-eyebrow">{s.proof.k}</span>
                    <span className="font-display text-[15px] font-semibold text-foreground">{s.proof.v}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process strip */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-20">
        <Reveal>
          <p className="label-eyebrow">How we work</p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">
            A predictable path from idea to operated system.
          </h2>
        </Reveal>
        <div className="relative mt-10">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          <ol className="grid gap-4 md:grid-cols-5">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.05}>
                <li className="glass relative rounded-2xl p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{p.step}</div>
                  <div className="mt-2 font-display text-[16px] font-semibold">{p.title}</div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

/* ---------- shared bits for this page ---------- */

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

function ServiceVisual({ icon: Icon, index }: { icon: typeof Brain; index: number }) {
  // Six distinct CSS-driven visuals keyed off the index.
  const variants = [
    "from-violet/30 via-blue/15 to-transparent",
    "from-cyan/25 via-blue/15 to-transparent",
    "from-blue/30 via-violet/15 to-transparent",
    "from-violet/25 via-cyan/15 to-transparent",
    "from-cyan/30 via-violet/15 to-transparent",
    "from-blue/25 via-cyan/15 to-transparent",
  ];
  return (
    <div className="glass animated-border relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className={`pointer-events-none absolute -inset-10 -z-10 bg-gradient-to-br ${variants[index % 6]} blur-3xl`} />
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.15]" />
      <div className="flex aspect-[5/4] flex-col">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-violet">
            <Icon size={18} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
            ainza.system / module {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-6 grid flex-1 grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/8 bg-white/[0.03]"
              style={{
                opacity: 0.4 + ((i + index) % 5) * 0.12,
              }}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/8">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet to-cyan" />
          </div>
          <span className="font-mono text-[10px] text-dim">OK</span>
        </div>
      </div>
    </div>
  );
}

function CtaBand() {
  return (
    <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] pb-28">
      <Reveal>
        <div className="glass-strong animated-border relative overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16">
          <div className="pointer-events-none absolute -inset-20 -z-10 bg-radial-spot opacity-80" />
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="label-eyebrow">Start a project</p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                Tell us about the system you need built — or rebuilt.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                A short call is usually enough to know whether we're the right partner.
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
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.06]"
              >
                See client work
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}