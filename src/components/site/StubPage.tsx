import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function StubPage({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <section className="relative overflow-hidden pb-32 pt-40">
      <div className="absolute inset-0 -z-10 bg-radial-spot" />
      <div className="mx-auto w-[min(900px,calc(100%-32px))] text-center">
        <p className="label-eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-balance font-display text-[clamp(2.2rem,4.8vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
          <span className="text-gradient-brand">{title}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">{blurb}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5">
            Talk to AINZA <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-foreground hover:bg-white/5">
            Back to Home
          </Link>
        </div>
        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">Full page coming soon</p>
      </div>
    </section>
  );
}