import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";

const Linkedin = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.86a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.48v-4.58c0-2.47-1.32-3.62-3.08-3.62-1.42 0-2.06.78-2.42 1.33V9.99h-2.67c.04.76 0 8.35 0 8.35h2.67v-4.66c0-.24.02-.48.09-.65.19-.48.62-.97 1.36-.97.96 0 1.34.73 1.34 1.8v4.48h2.71z" />
  </svg>
);
const Instagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const Facebook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
  </svg>
);
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";

const footerNav = [
  {
    title: "Explore",
    links: [
      { href: "/opportunities", label: "Opportunities" },
      { href: "/events", label: "Events" },
      { href: "/advice", label: "Career Advice" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Get in touch",
    links: [{ href: "/join#form", label: "Join Polaris" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-navy-100">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex">
              <Logo variant="white" />
            </Link>
            <p className="mt-5 text-sm leading-6 text-navy-200 max-w-xs">
              {siteConfig.tagline}. Career planning, mentoring and interview
              preparation for ambitious graduates.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.socials.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socials.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-sand-200">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-navy-100 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 text-sm border-t border-white/10 pt-8">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 text-sand-300 shrink-0" />
            <span className="text-navy-200">
              {siteConfig.contact.address.line1}
              <br />
              {siteConfig.contact.address.line2}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-sand-300 shrink-0" />
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="text-navy-200 hover:text-white"
            >
              {siteConfig.contact.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-sand-300 shrink-0" />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-navy-200 hover:text-white"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        <div className="mt-10 text-xs text-navy-300">
          <p>
            ©{" "}
            <Link
              href="/admin/login"
              aria-label="Staff sign in"
              className="hover:text-white"
              title="Staff"
            >
              {new Date().getFullYear()}
            </Link>{" "}
            Polaris Consulting Ltd. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
