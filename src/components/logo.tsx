import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "navy" | "white";
  className?: string;
  /** rendered height in px (width auto). Defaults to 36. */
  height?: number;
};

/**
 * Brand logo (horizontal lock-up).
 *
 * Uses the cropped artwork at /brand/logo-horizontal-dark.png. For dark
 * backgrounds the `white` variant inverts the artwork via CSS — the source
 * file is solid black so `invert(1)` gives a pure white render.
 */
export function Logo({ variant = "navy", className, height = 36 }: LogoProps) {
  const ratio = 623 / 203; // aspect ratio of the cropped PNG
  const width = Math.round(height * ratio);
  return (
    <Image
      src="/brand/logo-horizontal-dark.png"
      alt="Polaris Consulting"
      width={width}
      height={height}
      priority
      className={cn(
        "block",
        variant === "white" && "brightness-0 invert",
        className
      )}
      style={{ height, width: "auto" }}
    />
  );
}
