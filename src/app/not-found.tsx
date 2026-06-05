import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 opacity-[0.12] bg-[url('/brand/pattern-dark.webp')] bg-cover bg-center"
          aria-hidden="true"
        />
        <Container className="relative min-h-[60vh] flex flex-col items-center justify-center text-center py-24">
          <p className="text-xs uppercase tracking-widest text-sand-300 font-semibold">
            404
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-light tracking-tight">
            We couldn&apos;t find that page.
          </h1>
          <p className="mt-5 text-lg text-navy-100 max-w-md">
            The link may be broken or the page may have moved. Let&apos;s get you
            back on track.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <ButtonLink href="/" variant="secondary" size="lg">
              Back to home
            </ButtonLink>
            <ButtonLink
              href="/opportunities"
              size="lg"
              className="bg-transparent text-white hover:bg-white hover:text-navy-900 border border-white"
            >
              Browse opportunities
            </ButtonLink>
          </div>
          <Link
            href="/contact"
            className="mt-6 text-sm text-navy-200 underline underline-offset-4 hover:text-white"
          >
            Or get in touch
          </Link>
        </Container>
      </section>
    </div>
  );
}
