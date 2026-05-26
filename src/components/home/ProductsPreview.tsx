import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/site/Reveal";
import yes from "@/assets/generated/product-yes-fashion.jpg";
import abrar from "@/assets/generated/product-abrar.jpg";
import elite from "@/assets/generated/product-elite.jpg";

type Tag = string;

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-violet/40 hover:text-foreground">
      {children}
    </span>
  );
}

const CLIENTS = ["YES Fashion", "Abrar Forwarders", "Elite Enterprises"] as const;

export function ProductsPreview() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* studio table backdrop, distinct from services */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(187,165,255,0.18),transparent_60%),radial-gradient(900px_500px_at_50%_110%,rgba(124,167,255,0.14),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="mx-auto max-w-[1180px] px-4">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-eyebrow">Products & Client Solutions</p>
              <h2 className="mt-3 max-w-2xl text-balance font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-tight tracking-tight">
                Solutions built around real business outcomes.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                AINZA builds practical software, automation systems, and premium digital platforms
                that help businesses save time, improve operations, and present themselves with
                confidence.
              </p>
            </div>
            <Link
              to="/products"
              className="group hidden items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 md:inline-flex"
            >
              Explore Products
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        {/* showcase grid: 1 large + 2 stacked */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          {/* Featured */}
          <Reveal>
            <motion.article
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-3 md:p-4"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <motion.img
                  src={yes}
                  alt="Workflow software interface mockup built for YES Fashion"
                  loading="lazy"
                  className="h-[280px] w-full object-cover md:h-[420px]"
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/90">
                  Featured · YES Fashion
                </span>
              </div>
              <div className="flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                    Workflow Software & Automation
                  </h3>
                  <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
                    AI-assisted workflow software and automation tools built to reduce manual
                    effort, speed up processing, and improve daily operations.
                  </p>
                </div>
                <ArrowUpRight className="hidden text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground md:block" />
              </div>
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                <Tag>Workflow Automation</Tag>
                <Tag>Software</Tag>
                <Tag>AI-assisted Processing</Tag>
              </div>
            </motion.article>
          </Reveal>

          {/* Stacked */}
          <div className="flex flex-col gap-6">
            <CompactCard
              img={abrar}
              alt="Logistics website mockup built for Abrar Forwarders"
              eyebrow="Abrar Forwarders"
              title="Enterprise Logistics Website"
              desc="A premium logistics website designed to present industrial operations with clarity, trust, and enterprise credibility."
              tags={["Web Development", "Logistics", "Digital Presence"]}
            />
            <CompactCard
              img={elite}
              alt="Industrial services platform mockup built for Elite Enterprises"
              eyebrow="Elite Enterprises"
              title="Industrial Services Platform"
              desc="A modern industrial services platform built to showcase lifting solutions, equipment rentals, and operational capability."
              tags={["Web Development", "Industrial Services", "Rental Platform"]}
            />
          </div>
        </div>

        {/* trust plaque */}
        <Reveal delay={0.05}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
            <div className="grid items-center gap-6 px-6 py-6 md:grid-cols-[auto_1fr] md:px-8">
              <p className="label-eyebrow whitespace-nowrap">Trusted by ambitious businesses</p>
              <ul className="flex flex-wrap items-center justify-start gap-x-10 gap-y-3 md:justify-end">
                {CLIENTS.map((c) => (
                  <li
                    key={c}
                    className="font-display text-[15px] font-semibold tracking-[0.18em] text-foreground/80 [text-shadow:0_0_18px_rgba(187,165,255,0.18)] transition-colors hover:text-foreground"
                  >
                    {c.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-foreground hover:bg-white/5"
          >
            Explore Products <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CompactCard({
  img,
  alt,
  eyebrow,
  title,
  desc,
  tags,
}: {
  img: string;
  alt: string;
  eyebrow: string;
  title: string;
  desc: string;
  tags: Tag[];
}) {
  const reduce = useReducedMotion();
  return (
    <Reveal>
      <motion.article
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-3"
      >
        <div className="relative overflow-hidden rounded-2xl">
          <motion.img
            src={img}
            alt={alt}
            loading="lazy"
            className="h-[180px] w-full object-cover md:h-[200px]"
            whileHover={reduce ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full glass px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/90">
            {eyebrow}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
