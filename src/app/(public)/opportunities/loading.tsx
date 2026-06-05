import { Container } from "@/components/ui/container";
import { HeroSkeleton, FilterBarSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <section className="bg-paper py-12">
        <Container>
          <FilterBarSkeleton />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-navy-100 bg-white p-6 animate-pulse"
              >
                <div className="h-3 w-24 rounded bg-navy-100" />
                <div className="mt-3 h-6 w-1/2 rounded bg-navy-100" />
                <div className="mt-4 flex gap-4">
                  <div className="h-3 w-28 rounded bg-navy-50" />
                  <div className="h-3 w-20 rounded bg-navy-50" />
                  <div className="h-3 w-24 rounded bg-navy-50" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
