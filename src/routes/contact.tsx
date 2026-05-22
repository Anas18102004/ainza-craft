import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/site/StubPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AINZA" },
      { name: "description", content: "Start a project with AINZA — secure, intelligent, and scalable technology built to perform long after launch." },
      { property: "og:title", content: "Contact — AINZA" },
      { property: "og:description", content: "Let's talk about what to build next." },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="Contact"
      title="Let's build what's next, together."
      blurb="The full contact page is on its way. Email us or share a quick brief and we'll be in touch."
    />
  ),
});