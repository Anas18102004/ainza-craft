import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import heroLab from "@/assets/generated/hero-lab.jpg";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-36 md:pb-32 md:pt-40">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroLab}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-radial-spot opacity-80" />
      </div>

      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles size={12} className="text-violet" />
            <span className="font-mono">Built around real operations</span>
          </div>

          <h1 className="mt-6 text-balance font-display text-[clamp(2.4rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            <span className="text-gradient-brand">Engineering intelligent systems,</span>
            <br />
            secure platforms, and digital
            <br className="hidden md:block" /> products for real business growth.
          </h1>

          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">
            AINZA helps ambitious businesses design, build, automate, and scale
            technology that performs beyond launch — with security, clarity, and
            long-term support at the core.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5"
            >
              Start a Project
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
            >
              Explore Services
            </Link>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6 text-sm">
            <Stat k="Engineering" v="AI · Security · Cloud" />
            <Stat k="Approach" v="Business-first" />
            <Stat k="Commitment" v="Support after launch" />
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label-eyebrow">{k}</dt>
      <dd className="mt-1 text-[13px] text-foreground/90">{v}</dd>
    </div>
  );
}