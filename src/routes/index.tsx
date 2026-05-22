import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { WhyAinza } from "@/components/home/WhyAinza";
import { AboutPreview } from "@/components/home/AboutPreview";
import { FinalCta } from "@/components/home/FinalCta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AINZA — Engineering intelligent systems for real business growth" },
      { name: "description", content: "AI systems, cybersecurity, web & mobile, digital platforms, cloud & DevOps — built around real operations and supported long after launch." },
      { property: "og:title", content: "AINZA — Engineering intelligent systems" },
      { property: "og:description", content: "Secure, intelligent, and scalable technology built around real business outcomes." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesPreview />
      <ProductsPreview />
      <WhyAinza />
      <AboutPreview />
      <FinalCta />
    </>
  );
}
