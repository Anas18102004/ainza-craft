import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { ArrowRight, CheckCircle2, Clock3, DatabaseZap, ShieldCheck } from "lucide-react";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";

import {
  budgetRangeOptions,
  leadInputSchema,
  serviceInterestOptions,
  type LeadInput,
} from "@/lib/leads";

const submitLead = createServerFn({ method: "POST" })
  .inputValidator(leadInputSchema)
  .handler(async ({ data }) => {
    const { createLead } = await import("@/server/leads");
    const leadId = await createLead(data);

    return { success: true, leadId };
  });

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - AINZA" },
      {
        name: "description",
        content:
          "Start a project with AINZA - secure, intelligent, and scalable technology built to perform long after launch.",
      },
      { property: "og:title", content: "Contact - AINZA" },
      {
        property: "og:description",
        content: "Scope an AI, security, platform, or product build with AINZA.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submitLeadFn = useServerFn(submitLead);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: LeadInput = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      serviceInterest: String(
        formData.get("serviceInterest") ?? serviceInterestOptions[0],
      ) as LeadInput["serviceInterest"],
      budgetRange: String(
        formData.get("budgetRange") ?? budgetRangeOptions[0],
      ) as LeadInput["budgetRange"],
      message: String(formData.get("message") ?? ""),
      sourcePath: typeof window === "undefined" ? "/contact" : window.location.pathname,
    };

    const parsed = leadInputSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Please check the details and try again.");
      return;
    }

    try {
      await submitLeadFn({ data: parsed.data });
      form.reset();
      setStatus("success");
      setMessage("Your inquiry is in. AINZA will review it and respond with a sharp next step.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("We could not submit this right now. Please email us directly or try again soon.");
    }
  }

  return (
    <section className="relative overflow-hidden pb-32 pt-36 md:pt-44">
      <div className="absolute inset-0 -z-10 bg-radial-spot" />
      <div className="absolute left-1/2 top-24 -z-10 h-64 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-violet/15 blur-3xl" />

      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="min-w-0 pt-4">
          <p className="label-eyebrow">Start a project</p>
          <h1 className="mt-4 text-balance font-display text-[clamp(2.4rem,5vw,5.25rem)] font-semibold leading-[0.96] tracking-tight">
            <span className="text-gradient-brand">Scope the system that moves the business.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            Tell us what you are trying to build, secure, automate, or scale. We will turn the brief
            into a practical first conversation: risks, roadmap, budget shape, and the fastest route
            to production.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              {
                icon: Clock3,
                title: "Fast triage",
                text: "Clear response and next action.",
              },
              {
                icon: ShieldCheck,
                title: "Private by default",
                text: "No public client database writes.",
              },
              {
                icon: DatabaseZap,
                title: "Tracked lead flow",
                text: "Stored safely in Firestore.",
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-4">
                <item.icon className="h-5 w-5 text-violet" />
                <h2 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              Explore services
            </Link>
            <Link
              to="/ai-systems"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-violet/15"
            >
              AI systems{" "}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="glass-strong animated-border relative min-w-0 overflow-hidden rounded-3xl p-5 md:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label-eyebrow">Project inquiry</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
                Send a focused brief
              </h2>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-200">
              Firestore ready
            </span>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" required />
              <Field label="Email" name="email" type="email" autoComplete="email" required />
            </div>

            <Field label="Company" name="company" autoComplete="organization" />

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Service interest"
                name="serviceInterest"
                options={serviceInterestOptions}
              />
              <SelectField label="Budget range" name="budgetRange" options={budgetRangeOptions} />
            </div>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              Project notes
              <textarea
                name="message"
                required
                rows={7}
                placeholder="What needs to change, what exists today, and what outcome would make this project worth it?"
                className="min-h-40 resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-violet/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet/10"
              />
            </label>

            {message ? (
              <div
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                    : "border-red-300/20 bg-red-300/10 text-red-100"
                }`}
                role="status"
              >
                {status === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : null}
                <span>{message}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === "pending"}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet to-blue px-6 py-3 text-sm font-semibold text-[#0a0a16] shadow-[0_18px_50px_-12px_rgba(187,165,255,0.55)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "pending" ? "Submitting..." : "Send inquiry"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "name" | "type">) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <input
        name={name}
        type={type}
        className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-violet/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet/10"
        {...props}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <select
        name={name}
        className="min-h-12 rounded-2xl border border-white/10 bg-[#101024] px-4 text-sm text-foreground outline-none transition focus:border-violet/60 focus:ring-4 focus:ring-violet/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
