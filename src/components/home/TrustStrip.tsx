import { Briefcase, ShieldCheck, LifeBuoy, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const items = [
  { icon: Briefcase, label: "Business-first solutions" },
  { icon: ShieldCheck, label: "Security by design" },
  { icon: LifeBuoy, label: "Support after launch" },
  { icon: TrendingUp, label: "Built to scale" },
];

export function TrustStrip() {
  return (
    <section className="relative -mt-10 pb-10 md:pb-16">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl glass-strong light-sweep">
            <ul className="relative z-10 grid grid-cols-2 divide-white/5 md:grid-cols-4 md:divide-x">
              {items.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-violet transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_-2px_rgba(187,165,255,0.5)]">
                    <Icon size={16} />
                  </span>
                  <span className="text-[13px] font-medium tracking-wide text-foreground/90">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}