"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console / any attached logging.
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 opacity-[0.12] bg-[url('/brand/pattern-dark.webp')] bg-cover bg-center"
          aria-hidden="true"
        />
        <Container className="relative min-h-[60vh] flex flex-col items-center justify-center text-center py-24">
          <p className="text-xs uppercase tracking-widest text-sand-300 font-semibold">
            Something went wrong
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-light tracking-tight">
            We hit a snag loading this page.
          </h1>
          <p className="mt-5 text-lg text-navy-100 max-w-md">
            This is usually temporary. Try again, or head back to the homepage.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} variant="secondary" size="lg">
              Try again
            </Button>
            <ButtonLink
              href="/"
              size="lg"
              className="bg-transparent text-white hover:bg-white hover:text-navy-900 border border-white"
            >
              Back to home
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
