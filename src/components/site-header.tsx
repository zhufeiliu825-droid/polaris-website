"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-navy-100">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" aria-label="Polaris Consulting home">
          <Logo variant="navy" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-navy-800 hover:text-navy-950 rounded-full hover:bg-navy-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ButtonLink href="/join" variant="primary" size="sm">
            Join us
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden p-2 text-navy-900"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div
        className={cn(
          "lg:hidden border-t border-navy-100 bg-white overflow-hidden transition-all",
          open ? "max-h-[600px]" : "max-h-0"
        )}
      >
        <Container className="py-4 flex flex-col gap-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-base font-medium text-navy-900 hover:bg-navy-50 rounded-lg"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 mt-2 border-t border-navy-100">
            <ButtonLink
              href="/join"
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Join us
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
