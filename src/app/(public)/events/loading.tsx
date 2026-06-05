import { Container } from "@/components/ui/container";
import { HeroSkeleton, CardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <section className="py-16 bg-paper">
        <Container>
          <div className="space-y-2.5 mb-10 border-b border-navy-100 pb-6 animate-pulse">
            <div className="h-9 w-72 rounded-full bg-navy-50" />
            <div className="h-9 w-56 rounded-full bg-navy-50" />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <CardSkeleton className="h-56" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
