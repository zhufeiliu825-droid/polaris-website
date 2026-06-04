import { cn } from "@/lib/utils";

export function StarIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="M32 2 L34 22 L52 12 L42 30 L62 32 L42 34 L52 52 L34 42 L32 62 L30 42 L12 52 L22 34 L2 32 L22 30 L12 12 L30 22 Z"
      />
      <rect
        x="29"
        y="29"
        width="6"
        height="6"
        transform="rotate(45 32 32)"
        fill="var(--color-paper, white)"
      />
    </svg>
  );
}
