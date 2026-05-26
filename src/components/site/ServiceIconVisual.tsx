import {
  Brain,
  CloudCog,
  Compass,
  LayoutDashboard,
  Network,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export type ServiceVisualId = "ai" | "cyber" | "apps" | "platform" | "cloud" | "strategy";

const ICONS: Record<ServiceVisualId, LucideIcon> = {
  ai: Brain,
  cyber: ShieldCheck,
  apps: Smartphone,
  platform: Network,
  cloud: CloudCog,
  strategy: Compass,
};

const ALT: Record<ServiceVisualId, string> = {
  ai: "AI systems icon",
  cyber: "Cybersecurity icon",
  apps: "Web and mobile development icon",
  platform: "Digital platforms icon",
  cloud: "Cloud and DevOps icon",
  strategy: "Strategy and consulting icon",
};

type ServiceIconVisualProps = {
  id: ServiceVisualId;
  className?: string;
  imageClassName?: string;
  decorative?: boolean;
  platformVariant?: "network" | "dashboard";
};

export function ServiceIconVisual({
  id,
  className = "",
  imageClassName = "",
  decorative = false,
  platformVariant = "network",
}: ServiceIconVisualProps) {
  const Icon = id === "platform" && platformVariant === "dashboard" ? LayoutDashboard : ICONS[id];
  return (
    <span
      className={`service-icon-visual ${className}`}
      data-service={id}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : ALT[id]}
      aria-hidden={decorative || undefined}
    >
      <Icon
        className={`service-icon-visual-svg ${imageClassName}`}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>
  );
}
