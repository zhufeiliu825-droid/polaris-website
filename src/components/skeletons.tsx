import { Container } from "@/components/ui/container";

/** Navy hero placeholder matching PageHero's height, for loading.tsx files. */
export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <Container className="relative min-h-[420px] md:min-h-[480px] pt-24 md:pt-28 pb-16 md:pb-20 flex flex-col justify-start">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="mt-5 h-10 w-3/4 rounded bg-white/10" />
        <div className="mt-3 h-10 w-2/3 rounded bg-white/10" />
        <div className="mt-6 h-4 w-1/2 rounded bg-white/5" />
      </Container>
    </section>
  );
}

/** A single pulsing card placeholder. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-navy-100 bg-white p-6 animate-pulse " +
        (className ?? "")
      }
    >
      <div className="h-3 w-20 rounded bg-navy-100" />
      <div className="mt-4 h-5 w-3/4 rounded bg-navy-100" />
      <div className="mt-3 h-3 w-full rounded bg-navy-50" />
      <div className="mt-2 h-3 w-2/3 rounded bg-navy-50" />
    </div>
  );
}

/** A row of pill placeholders for the filter bar. */
export function FilterBarSkeleton() {
  return (
    <div className="border-b border-navy-100 pb-6 mb-8 space-y-5 animate-pulse">
      <div className="h-11 w-full max-w-md rounded-full bg-navy-50" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-navy-50" />
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-navy-50" />
        ))}
      </div>
    </div>
  );
}
