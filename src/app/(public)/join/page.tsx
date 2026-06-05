import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { JoinForm } from "./join-form";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Get in touch",
  description:
    "Tell us about your goals in five quick steps and a Polaris mentor will be in touch within five working days.",
};

const benefits = [
  "1-to-1 mentor matched to your target sector",
  "Live opportunities, events and advice",
  "Mock interviews with senior recruiters",
  "Network of 200+ alumni in top firms",
];

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Tell us about you — in five quick steps."
        subtitle="The more we know, the better we can match you with the right mentor and opportunities. Most people finish in under five minutes."
      />

      {/* id="form" — landing target for "Get in touch" / Contact CTA buttons
          elsewhere on the site, so /join#form scrolls past the intro and
          drops the user straight into the form. */}
      <section id="form" className="py-16 md:py-20 bg-paper scroll-mt-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-8">
              <div className="bg-navy-950 text-white rounded-2xl p-8">
                <p className="text-xs uppercase tracking-widest text-sand-300 font-semibold">
                  What you get
                </p>
                <ul className="mt-5 space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-navy-100">
                      <CheckCircle2 className="h-5 w-5 text-sand-300 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-sand-50 rounded-2xl p-7 border border-sand-200">
                <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                  Why we ask so much
                </p>
                <p className="mt-3 text-sm text-navy-700 leading-relaxed">
                  Every field helps us match you with the right mentor, surface
                  the most relevant opportunities, and prep for your first
                  conversation. The more detail you share, the more useful that
                  first call will be.
                </p>
                <p className="mt-4 text-xs text-navy-500">
                  Your data is private to the Polaris team and never shared
                  without your permission.
                </p>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <JoinForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

