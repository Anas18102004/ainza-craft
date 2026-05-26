import { Link } from "@tanstack/react-router";
import { BrandLockup } from "@/components/site/BrandWordmark";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-black/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div className="mx-auto grid max-w-[1180px] px-4 gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandLockup />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Engineering intelligent systems, secure platforms, and digital products built for
            long-term growth.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-gradient-to-r from-violet to-blue px-4 py-2 text-[12px] font-semibold text-[#0a0a16]"
            >
              Start a Project
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/15 px-4 py-2 text-[12px] font-medium text-foreground hover:bg-white/5"
            >
              Talk to AINZA
            </Link>
          </div>
        </div>

        <FooterCol
          title="Navigate"
          links={[
            ["Home", "/"],
            ["Services", "/services"],
            ["Products", "/products"],
            ["AI Systems", "/ai-systems"],
            ["About", "/about"],
            ["Contact", "/contact"],
          ]}
        />

        <FooterCol
          title="Services"
          links={[
            ["AI Systems & Automation", "/services"],
            ["Cybersecurity", "/services"],
            ["Web & Mobile Development", "/services"],
            ["Digital Platforms", "/services"],
            ["Cloud & DevOps", "/services"],
            ["Strategy & Consulting", "/services"],
          ]}
        />

        <FooterCol
          title="Talk to us"
          links={[
            ["Start a Project", "/contact"],
            ["Talk to AINZA", "/contact"],
          ]}
        />
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1180px] px-4 flex-col items-start justify-between gap-2 py-6 text-[12px] text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} AINZA. All rights reserved.</span>
          <span className="font-mono text-dim">Built around real operations.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div>
      <h4 className="label-eyebrow">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
