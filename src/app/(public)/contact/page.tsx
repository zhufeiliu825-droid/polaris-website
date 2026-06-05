import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about where you want to go."
        subtitle="Drop us a line, give us a ring, or come visit us at our London office. The fastest way to start working with us is via our short intake form."
      />

      <section className="py-20 md:py-28 bg-paper">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* INFO — left column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-1 block text-lg text-navy-950 hover:text-navy-700"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                    Phone
                  </p>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="mt-1 block text-lg text-navy-950 hover:text-navy-700"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                    Office
                  </p>
                  <address className="mt-1 not-italic text-navy-700 leading-relaxed">
                    {siteConfig.contact.address.line1}
                    <br />
                    {siteConfig.contact.address.line2}
                  </address>
                </div>
              </div>

              <div className="pt-4">
                <iframe
                  src="https://maps.google.com/maps?q=180+Strand+London+WC2R+1EA&output=embed"
                  className="w-full h-64 rounded-2xl border border-navy-100"
                  loading="lazy"
                  title="Polaris Consulting on Google Maps"
                />
              </div>
            </div>

            {/* CTA — right column (replaces the old contact form) */}
            <Link
              href="/join#form"
              className="group lg:col-span-7 relative overflow-hidden bg-navy-950 text-white rounded-2xl p-10 md:p-14 flex flex-col justify-between hover:bg-navy-900 transition-colors min-h-[480px]"
            >
              <div
                className="absolute inset-0 opacity-10 bg-[url('/brand/pattern-dark.webp')] bg-cover bg-center"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sand-300 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ready to start?
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight leading-tight">
                  Get in touch in five minutes.
                </h2>
                <p className="mt-5 text-lg text-navy-100 leading-relaxed max-w-md">
                  Tell us about your goals, your background, and where you want
                  to land. A mentor will reach out within five working days to
                  talk through the right programme for you.
                </p>

                <ul className="mt-7 space-y-2.5 text-sm text-navy-100">
                  {[
                    "Free initial 30-minute consultation",
                    "Mentor match within five working days",
                    "Tailored programme recommendation, no obligation",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sand-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-10 inline-flex items-center gap-3 self-start h-12 px-7 rounded-full bg-white text-navy-950 font-medium text-base group-hover:gap-4 transition-all">
                Open the contact form
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
