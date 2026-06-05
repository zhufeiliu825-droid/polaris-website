import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div
        className="absolute inset-0 opacity-[0.12] bg-[url('/brand/pattern-dark.webp')] bg-cover bg-center"
        aria-hidden="true"
      />
      {/* Fixed min-height + top-anchored content so the eyebrow and h1
          land at the same Y on every page — switching between Events,
          Advice, Opportunities, etc. no longer shifts the layout. */}
      <Container className="relative min-h-[420px] md:min-h-[480px] pt-24 md:pt-28 pb-16 md:pb-20 flex flex-col justify-start">
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest text-sand-300 font-semibold">
            {eyebrow}
          </p>
        )}
        {/* Start smaller on mobile so long single words (e.g. "opportunities")
            never overflow a narrow viewport. Single desktop size (no lg:
            scale-up) keeps the title weight consistent across pages. */}
        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.12] max-w-3xl text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-navy-100 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
