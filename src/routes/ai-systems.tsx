import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/site/StubPage";

export const Route = createFileRoute("/ai-systems")({
  head: () => ({
    meta: [
      { title: "AI Systems — AINZA" },
      { name: "description", content: "Intelligent tools and workflow automation designed around real business operations." },
      { property: "og:title", content: "AI Systems — AINZA" },
      { property: "og:description", content: "AI built around real operations, not novelty." },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="AI Systems"
      title="Intelligent systems designed around real operations."
      blurb="A dedicated AI Systems page is on its way. For now, tell us about the workflow you want to automate."
    />
  ),
});