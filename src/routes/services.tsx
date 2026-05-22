import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/site/StubPage";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AINZA" },
      { name: "description", content: "AI systems, cybersecurity, web & mobile, digital platforms, cloud & DevOps, and strategy from AINZA." },
      { property: "og:title", content: "Services — AINZA" },
      { property: "og:description", content: "Services built around real business needs." },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="Services"
      title="Services built around real business needs."
      blurb="From intelligent automation to secure platforms — the full services page is on its way. In the meantime, let's talk about your operations."
    />
  ),
});