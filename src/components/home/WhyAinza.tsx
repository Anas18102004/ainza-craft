import { Target, Headphones, ShieldCheck, Handshake, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/site/Reveal";

type Pillar = { n: string; title: string; desc: string; icon: LucideIcon };

const PILLARS: Pillar[] = [
  {
    n: "01",
    title: "We solve real business problems.",
    desc: "Every solution is shaped around operations, goals, and measurable outcomes.",
    icon: Target,
  },
  {
    n: "02",
    title: "We stay involved after launch.",
    desc: "We provide support, improvements, and guidance after delivery.",
    icon: Headphones,
  },
  {
    n: "03",
    title: "We build secure, reliable systems.",
    desc: "Security, performance, and maintainability are considered from the start.",
    icon: ShieldCheck,
  },
  {
    n: "04",
    title: "We act as a long-term partner.",
    desc: "We grow with your business and build technology for what comes next.",
    icon: Handshake,
  },
];

export function WhyAinza() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* serious blueprint backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-10%,rgba(124,167,255,0.10),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-[1180px] px-4">
        <Reveal>
          <div className="max-w-2xl">
            <p className="label-eyebrow">The AINZA Standard</p>
            <h2 className="mt-3 text-balance font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-tight tracking-tight">
              Why businesses choose AINZA.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              We do more than deliver projects. We build systems around your business, support them
              after launch, and help them improve as you grow.
            </p>
          </div>
        </Reveal>

        <div ref={ref} className="relative mt-16">
          {/* vertical track */}
          <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={reduce ? { height: "100%" } : { height: lineHeight }}
            className="pointer-events-none absolute left-5 top-0 w-px bg-gradient-to-b from-violet via-blue to-cyan md:left-1/2 md:-translate-x-1/2"
          />

          <ul className="space-y-10 md:space-y-16">
            {PILLARS.map((p, i) => {
              const isRight = i % 2 === 1;
              return (
                <li
                  key={p.n}
                  className="relative grid grid-cols-[40px_1fr] gap-4 md:grid-cols-2 md:gap-8"
                >
                  {/* marker — desktop centered, mobile left */}
                  <span className="absolute left-5 top-3 -translate-x-1/2 md:left-1/2" aria-hidden>
                    <span className="block h-3 w-3 rounded-full bg-violet shadow-[0_0_18px_rgba(187,165,255,0.9)] ring-4 ring-background" />
                  </span>

                  {/* spacer on opposite column for desktop layout */}
                  {isRight && <div className="hidden md:block" />}

                  <Reveal delay={i * 0.05} className={isRight ? "md:col-start-2" : ""}>
                    <div className="ml-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-violet/30 md:ml-0 md:p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[12px] tracking-[0.22em] text-dim">
                          {p.n}
                        </span>
                        <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-violet">
                          <p.icon size={16} />
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight md:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                        {p.desc}
                      </p>
                    </div>
                  </Reveal>

                  {!isRight && <div className="hidden md:block" />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
