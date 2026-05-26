import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/site/BrandWordmark";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/ai-systems", label: "AI Systems" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-4 top-4 z-50 mx-auto flex max-w-[1180px] items-center justify-between gap-6 rounded-2xl px-3 py-2 transition-all duration-500",
          scrolled ? "glass-strong ring-violet-glow" : "glass",
        ].join(" ")}
      >
        <Link to="/" className="flex min-h-11 items-center pl-2">
          <BrandLockup lockup="compact" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden rounded-full bg-gradient-to-r from-violet to-blue px-4 py-2 text-[13px] font-semibold text-[#0a0a16] shadow-[0_10px_30px_-10px_rgba(187,165,255,0.6)] transition-transform hover:-translate-y-px md:inline-flex"
          >
            Start a Project
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-foreground md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-x-4 top-20 z-40 rounded-2xl glass-strong p-3 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm text-foreground hover:bg-white/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-gradient-to-r from-violet to-blue px-3 py-3 text-center text-sm font-semibold text-[#0a0a16]"
              >
                Start a Project
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
