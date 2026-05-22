import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/site/StubPage";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — AINZA" },
      { name: "description", content: "Practical software, automation systems, and digital platforms by AINZA." },
      { property: "og:title", content: "Products — AINZA" },
      { property: "og:description", content: "Solutions built around real business outcomes." },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="Products & Client Solutions"
      title="Solutions built around real business outcomes."
      blurb="A full case-study page with deeper write-ups for YES Fashion, Abrar Forwarders, and Elite Enterprises is on its way."
    />
  ),
});