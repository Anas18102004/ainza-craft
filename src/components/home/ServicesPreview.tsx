import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Brain,
  ShieldCheck,
  Smartphone,
  Network,
  CloudCog,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/site/Reveal";
import servicesConsole from "@/assets/generated/services-console.jpg";

type Service = {
  id: string;
  short: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  // approximate center of the module in the console image (percent)
  spot: { x: number; y: number };
};

const SERVICES: Service[] = [
  { id: "ai",       short: "AI",        title: "AI Systems & Automation",     desc: "Intelligent tools and workflow automation designed around real business operations.", icon: Brain,       spot: { x: 22, y: 24 } },
  { id: "sec",      short: "Security",  title: "Cybersecurity",               desc: "Security-first systems built to protect data, users, and long-term reliability.",     icon: ShieldCheck, spot: { x: 72, y: 24 } },
  { id: "apps",     short: "Apps",      title: "Web & Mobile Development",    desc: "Modern applications designed for performance, usability, and scale.",                  icon: Smartphone,  spot: { x: 85, y: 38 } },
  { id: "platform", short: "Platforms", title: "Digital Platforms",           desc: "Scalable platforms that connect operations, customers, and growth.",                   icon: Network,     spot: { x: 16, y: 60 } },
  { id: "cloud",    short: "Cloud",     title: "Cloud & DevOps",              desc: "Reliable infrastructure, deployment, monitoring, and continuous improvement.",         icon: CloudCog,    spot: { x: 26, y: 70 } },
  { id: "strategy", short: "Strategy",  title: "Strategy & Consulting",       desc: "Clear technology planning before development begins.",                                 icon: Compass,     spot: { x: 78, y: 70 } },
];

export function ServicesPreview() {
  const [active, setActive] = useState(SERVICES[0].id);
  const reduce = useReducedMotion();
  const current = SERVICES.find((s) => s.id === active)!;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* section-specific bg: digital infrastructure */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_85%_20%,rgba(124,167,255,0.18),transparent_60%),radial-gradient(700px_460px_at_10%_80%,rgba(187,165,255,0.16),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal>
          <p className="label-eyebrow">Services</p>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-tight tracking-tight">
            Services built around real business needs.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            From intelligent automation to secure platforms, AINZA builds technology
            that solves practical business problems and keeps improving after launch.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* LEFT: console visual */}
          <Reveal>
            <div className="relative aspect-[5/5] overflow-hidden rounded-3xl border border-white/10 bg-black/40 md:aspect-[6/5]">
              <img
                src={servicesConsole}
                alt="AINZA service operations console visualization"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              {/* deep overlay for depth + readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-background/70" />

              {/* module dots */}
              {SERVICES.map((s) => {
                const isActive = s.id === active;
                return (
                  <div
                    key={s.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${s.spot.x}%`, top: `${s.spot.y}%` }}
                  >
                    <motion.div
                      animate={reduce ? undefined : isActive ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 18 }}
                      className={[
                        "group flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-md transition-colors",
                        isActive
                          ? "border-violet/60 bg-white/10 text-foreground shadow-[0_0_30px_-4px_rgba(187,165,255,0.7)]"
                          : "border-white/15 bg-black/40 text-muted-foreground",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          isActive ? "bg-violet shadow-[0_0_10px_rgba(187,165,255,0.9)]" : "bg-white/40",
                        ].join(" ")}
                      />
                      {s.short}
                    </motion.div>
                  </div>
                );
              })}

              {/* active caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl glass px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-violet">
                    <current.icon size={16} />
                  </span>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                      Selected module
                    </p>
                    <p className="text-sm font-medium">{current.title}</p>
                  </div>
                </div>
                <span className="hidden text-[11px] font-mono uppercase tracking-[0.2em] text-dim sm:inline">
                  online
                </span>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: interactive service stack */}
          <Reveal delay={0.05}>
            <ul className="rounded-3xl border border-white/10 bg-white/[0.02] p-2">
              {SERVICES.map((s) => {
                const isActive = s.id === active;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(s.id)}
                      onFocus={() => setActive(s.id)}
                      onClick={() => setActive(s.id)}
                      aria-expanded={isActive}
                      className={[
                        "group flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 md:p-5",
                        isActive
                          ? "bg-gradient-to-r from-white/[0.06] to-white/[0.01]"
                          : "hover:bg-white/[0.03]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-300",
                          isActive
                            ? "border-violet/40 bg-white/[0.05] text-violet shadow-[0_0_22px_-4px_rgba(187,165,255,0.6)]"
                            : "border-white/10 bg-white/[0.02] text-muted-foreground group-hover:text-foreground",
                        ].join(" ")}
                      >
                        <s.icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                            {s.title}
                          </h3>
                          <ArrowUpRight
                            size={16}
                            className={[
                              "shrink-0 text-muted-foreground transition-all",
                              isActive ? "translate-x-0.5 -translate-y-0.5 text-foreground" : "",
                            ].join(" ")}
                          />
                        </div>
                        <p
                          className={[
                            "mt-1 text-[13.5px] leading-relaxed text-muted-foreground transition-all",
                            isActive ? "opacity-100" : "opacity-80",
                          ].join(" ")}
                        >
                          {s.desc}
                        </p>
                      </div>
                    </button>
                    <div className="mx-4 h-px bg-white/5 last:hidden" />
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.5)] transition-transform hover:-translate-y-0.5"
              >
                View All Services
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-foreground hover:bg-white/5"
              >
                Talk to AINZA
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}