import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import yesImg from "@/assets/generated/product-yes-fashion.jpg";
import abrarImg from "@/assets/generated/product-abrar.jpg";
import eliteImg from "@/assets/generated/product-elite.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — AINZA" },
      { name: "description", content: "Practical software, automation systems, and digital platforms by AINZA." },
      { property: "og:title", content: "Products — AINZA" },
      { property: "og:description", content: "Solutions built around real business outcomes." },
    ],
  }),
  component: ProductsPage,
});

const CATEGORIES = [
  {
    id: "workflow",
    name: "Workflow & Automation Software",
    desc: "Internal systems that replace spreadsheets, email chains, and brittle manual steps.",
    examples: ["Order & inventory operations", "Approvals & document routing", "Production & logistics tracking"],
  },
  {
    id: "platforms",
    name: "Customer-Facing Platforms",
    desc: "Portals, marketplaces, and websites built for ongoing operation — not just launch day.",
    examples: ["Service & enterprise websites", "Client & partner portals", "Quoting & lead-capture systems"],
  },
  {
    id: "ai",
    name: "AI & Decision Systems",
    desc: "Models and copilots integrated into your operations with evals and human review.",
    examples: ["Document understanding", "Internal copilots", "Forecasting & anomaly detection"],
  },
];

const CASES = [
  {
    id: "yes",
    tag: "Workflow Software · Automation",
    client: "YES Fashion",
    title: "An operations system that runs the day-to-day floor.",
    body:
      "We replaced a tangle of spreadsheets and chat threads with a unified workflow system covering orders, production, inventory, and dispatch — with role-based access for floor staff, supervisors, and management.",
    img: yesImg,
    features: [
      "Real-time order & production status",
      "Inventory and reorder automation",
      "Role-based dashboards (floor → leadership)",
      "Audit trail and approval workflows",
    ],
    outcomes: [
      { k: "Manual entry removed", v: "~70%" },
      { k: "Order visibility", v: "End-to-end" },
      { k: "Time to dispatch", v: "Cut materially" },
    ],
  },
  {
    id: "abrar",
    tag: "Enterprise Logistics · Website",
    client: "Abrar Forwarders",
    title: "A logistics presence built for serious clients.",
    body:
      "A premium, fast, content-rich website that positions Abrar Forwarders against international competition — with service pages, quote capture, and clear messaging for freight, customs, and forwarding.",
    img: abrarImg,
    features: [
      "Service architecture (air, sea, road, customs)",
      "Quote capture & lead routing",
      "SEO foundation & performance budget",
      "CMS-ready content blocks",
    ],
    outcomes: [
      { k: "Core Web Vitals", v: "Green on launch" },
      { k: "Inbound lead path", v: "Structured" },
      { k: "Brand alignment", v: "Enterprise-grade" },
    ],
  },
  {
    id: "elite",
    tag: "Industrial Services · Platform",
    client: "Elite Enterprises",
    title: "An industrial services platform with depth.",
    body:
      "A widescreen, content-deep platform for an industrial services company — with project showcases, equipment and capability pages, and a contact pipeline designed for high-intent buyers.",
    img: eliteImg,
    features: [
      "Project & capability showcases",
      "Equipment / service catalogues",
      "High-intent contact pipeline",
      "Editorial CMS for ongoing content",
    ],
    outcomes: [
      { k: "Content depth", v: "Buyer-grade" },
      { k: "Mobile experience", v: "First-class" },
      { k: "Support model", v: "Ongoing partnership" },
    ],
  },
];

function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products & Client Solutions"
        title="Real systems, in production, for ambitious businesses."
        blurb="We build software that lives inside real operations — workflow systems, customer-facing platforms, and AI tools that ship, run, and evolve with the business."
      />

      {/* Categories */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <div className="glass h-full rounded-2xl p-6">
                <p className="label-eyebrow">Category · 0{i + 1}</p>
                <h3 className="mt-3 font-display text-[18px] font-semibold leading-snug">{c.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{c.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {c.examples.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-[13.5px] text-foreground/85">
                      <Check size={13} className="mt-1 shrink-0 text-cyan" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-16">
        <Reveal>
          <p className="label-eyebrow">Selected client work</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">
            Built with — and operated alongside — the teams that depend on them.
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-16">
          {CASES.map((c, i) => (
            <Reveal key={c.id}>
              <article className="grid gap-8 md:grid-cols-12 md:gap-10">
                <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="glass animated-border relative overflow-hidden rounded-3xl">
                    <img
                      src={c.img}
                      alt={`${c.client} product mockup`}
                      className="aspect-[16/10] w-full object-cover opacity-95"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  </div>
                </div>

                <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <p className="label-eyebrow">{c.tag}</p>
                  <h3 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                    {c.client}
                  </h3>
                  <p className="mt-2 font-display text-[18px] font-medium text-foreground/90">{c.title}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{c.body}</p>

                  <ul className="mt-5 space-y-1.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[14px] text-foreground/85">
                        <Check size={14} className="mt-1 shrink-0 text-cyan" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                    {c.outcomes.map((o) => (
                      <div key={o.k}>
                        <dt className="label-eyebrow">{o.k}</dt>
                        <dd className="mt-1 text-[13.5px] font-medium text-foreground">{o.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trusted by strip */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] py-14">
        <Reveal>
          <div className="glass light-sweep relative overflow-hidden rounded-2xl px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <p className="label-eyebrow">Trusted by ambitious businesses</p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                {["YES FASHION", "ABRAR FORWARDERS", "ELITE ENTERPRISES"].map((name) => (
                  <span
                    key={name}
                    className="font-mono text-[12px] tracking-[0.22em] text-foreground/80"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative mx-auto w-[min(1180px,calc(100%-32px))] pb-28 pt-8">
        <Reveal>
          <div className="glass-strong animated-border relative overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -inset-20 -z-10 bg-radial-spot opacity-80" />
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="label-eyebrow">Build with AINZA</p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-tight text-gradient-brand">
                  Have a system in mind? Let's scope it properly.
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Start a project <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.06]"
                >
                  Explore services <ExternalLink size={14} />
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