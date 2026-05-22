import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/site/StubPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AINZA" },
      { name: "description", content: "Founded by Hamza Meman and co-founded by Mohammad Anas, AINZA is a long-term technology partner." },
      { property: "og:title", content: "About — AINZA" },
      { property: "og:description", content: "A technology partner built for businesses that want more than delivery." },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="About AINZA"
      title="A technology partner built for businesses that want more than delivery."
      blurb="Founded by Hamza Meman and co-founded by Mohammad Anas. The full About page is on its way."
    />
  ),
});