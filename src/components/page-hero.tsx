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
        className="absolute inset-0 opacity-[0.12] bg-[url('/brand/pattern-dark.png')] bg-cover bg-center"
        aria-hidden="true"
      />
      {/* Fixed min-height so every page's hero matches — short titles
          centre vertically in the same box that long ones fill. */}
      <Container className="relative min-h-[420px] md:min-h-[480px] py-16 md:py-20 flex flex-col justify-center">
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest text-sand-300 font-semibold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] max-w-3xl">
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
