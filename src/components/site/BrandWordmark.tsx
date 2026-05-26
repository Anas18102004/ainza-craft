import logoMark from "@/assets/brand/logo.png";
import wordmark from "@/assets/brand/logo-text.png";

type BrandWordmarkProps = {
  className?: string;
  imageClassName?: string;
  lockup?: "compact" | "full";
};

export function BrandWordmark({
  className = "",
  imageClassName = "",
  lockup = "full",
}: BrandWordmarkProps) {
  return (
    <span className={`brand-wordmark brand-wordmark-${lockup} ${className}`}>
      <img src={wordmark} alt="AINZA" className={`brand-wordmark-image ${imageClassName}`} />
    </span>
  );
}

export function BrandLockup({
  className = "",
  imageClassName = "",
  lockup = "full",
}: BrandWordmarkProps) {
  return (
    <span className={`brand-lockup brand-lockup-${lockup} ${className}`}>
      <img src={logoMark} alt="" aria-hidden className="brand-lockup-mark" />
      <BrandWordmark lockup={lockup} imageClassName={imageClassName} />
    </span>
  );
}
