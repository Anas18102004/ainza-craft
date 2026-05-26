import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BrandWordmark } from "@/components/site/BrandWordmark";

export function FinalCta() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-4">
        <Reveal>
          <div className="animated-border relative overflow-hidden rounded-3xl glass-strong p-8 md:p-14">
            {/* light rays */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 280px at 15% 10%, rgba(187,165,255,0.30), transparent 60%), radial-gradient(600px 320px at 85% 100%, rgba(124,167,255,0.28), transparent 60%)",
              }}
            />
            <div className="pointer-events-none absolute -right-14 top-1/2 hidden w-[430px] -translate-y-1/2 rotate-[-4deg] opacity-20 md:block">
              <BrandWordmark imageClassName="scale-[1.16]" />
            </div>

            <div className="relative max-w-2xl">
              <p className="label-eyebrow">Ready when you are</p>
              <h2 className="mt-3 text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
                Ready to build what's next for your business?
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
                Let's create a secure, intelligent, and scalable solution built to perform long
                after launch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-5 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Talk to AINZA
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground hover:bg-white/[0.07]"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
