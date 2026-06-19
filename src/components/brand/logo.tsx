import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Intrinsic dimensions of the trimmed official wordmark (public/logo.png).
// Used to preserve the exact aspect ratio — never stretched or cropped.
const LOGO_W = 407;
const LOGO_H = 717;
const ASPECT = LOGO_W / LOGO_H;

/**
 * The official brand mark (calligraphy of «النخبة»). Rendered from
 * /public/logo.png with object-contain so proportions are always preserved.
 * `size` controls the rendered HEIGHT in pixels; width scales automatically.
 */
export function LogoMark({
  className,
  size = 44,
  priority = false,
  light = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
  /** Use the light (beige-white) mark for dark backgrounds. */
  light?: boolean;
}) {
  return (
    <Image
      src={light ? "/logo-light.png" : "/logo.png"}
      alt="شعار مؤسسة النخبة للعلوم الصينية"
      width={LOGO_W}
      height={LOGO_H}
      priority={priority}
      sizes={`${Math.round(size * ASPECT)}px`}
      className={cn("w-auto object-contain", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}

export function Logo({
  className,
  showText = true,
  variant = "dark",
  priority = false,
}: {
  className?: string;
  showText?: boolean;
  variant?: "dark" | "light";
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3", className)}
      aria-label="مؤسسة النخبة للعلوم الصينية"
    >
      <LogoMark size={44} priority={priority} light={variant === "light"} />
      {showText && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-display text-lg font-bold",
              variant === "light" ? "text-white" : "text-maroon-900",
            )}
          >
            مؤسسة النخبة
          </span>
          <span
            className={cn(
              "text-[11px] font-medium tracking-wide",
              variant === "light" ? "text-beige-200" : "text-maroon-600",
            )}
          >
            للعلوم الصينية
          </span>
        </span>
      )}
    </Link>
  );
}
