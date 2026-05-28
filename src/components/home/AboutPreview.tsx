import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/site/Reveal";
import boardroom from "@/assets/generated/about-boardroom.jpg";

export function AboutPreview() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_85%_10%,rgba(187,165,255,0.14),transparent_60%)]" />
      <div className="mx-auto grid max-w-[1180px] px-4 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <Reveal>
          <p className="label-eyebrow">About AINZA</p>
          <h2 className="mt-3 text-balance font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-tight">
            A technology partner built for businesses that want more than delivery.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Founded by <span className="text-foreground">Hamza Memon</span> and co-founded by{" "}
            <span className="text-foreground">Mohammad Anas</span>, AINZA combines strategy,
            engineering, design, and long-term support to help businesses build technology they can
            depend on.
          </p>

          <ul className="mt-6 space-y-2 text-[13.5px] text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              Founded by Hamza Memon
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              Co-founded by Mohammad Anas
            </li>
          </ul>

          <div className="mt-8">
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.07]"
            >
              About AINZA
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div
            ref={ref}
            className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/10 bg-black/40"
          >
            <motion.img
              src={boardroom}
              alt="Premium boardroom with installed 3D AINZA wall signage"
              loading="lazy"
              style={{ y }}
              className="absolute inset-0 h-[110%] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl glass px-4 py-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Leadership
                </p>
                <p className="text-sm font-medium">Hamza Memon · Mohammad Anas</p>
              </div>
              <span className="hidden text-[11px] font-mono uppercase tracking-[0.2em] text-dim sm:inline">
                est. AINZA
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
