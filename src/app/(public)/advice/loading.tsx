import { Container } from "@/components/ui/container";
import { HeroSkeleton, CardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <section className="py-16 bg-paper">
        <Container>
          <div className="flex gap-2 flex-wrap mb-10 border-b border-navy-100 pb-6 animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-navy-50" />
            ))}
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <CardSkeleton className="h-48" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
