import Link from "next/link";
import { ArrowRight, Compass, GraduationCap, Briefcase, Sparkles, Calendar, BookOpen, Building2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { StarIcon } from "@/components/star-icon";
import { siteConfig } from "@/lib/site";

const pillars = [
  {
    icon: Compass,
    title: "Assessment",
    text: "Scientific psychometric testing to uncover your potential and shape a path aligned to your strengths.",
  },
  {
    icon: GraduationCap,
    title: "Tutoring",
    text: "A competency-based curriculum across hard skills, industry understanding, behaviour and communication.",
  },
  {
    icon: Briefcase,
    title: "Practice",
    text: "Real-world interview simulations with recruiters from prestigious firms, with targeted feedback.",
  },
  {
    icon: Sparkles,
    title: "Supervision",
    text: "A dedicated supervisor accompanies you through every application, like a concierge service.",
  },
];

const stats = [
  { value: "20+", label: "years average mentor experience" },
  { value: "200+", label: "graduates supported" },
  { value: "8", label: "industries covered" },
  { value: "1:1", label: "personal mentoring" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 opacity-[0.18] bg-[url('/brand/pattern-dark.png')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900/95 to-navy-800/90" aria-hidden="true" />

        <Container className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs uppercase tracking-widest text-sand-200">
              <StarIcon className="h-3.5 w-3.5 text-sand-300" />
              {siteConfig.tagline}
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]">
              Find your{" "}
              <span className="text-sand-300">North Star</span>
              <br />
              and reach it.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-navy-100 max-w-2xl leading-relaxed">
              Polaris Consulting helps ambitious graduates secure entry-level
              roles in the world&apos;s most competitive industries — finance,
              consulting, technology, law and beyond.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ButtonLink href="/join#form" variant="secondary" size="lg">
                Get in touch <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/opportunities"
                variant="white"
                size="lg"
                className="bg-transparent text-white hover:bg-white hover:text-navy-900 border-white"
              >
                Browse opportunities
              </ButtonLink>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 border-t border-white/15 pt-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl md:text-4xl font-light text-sand-300">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-navy-200">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* WHY POLARIS — 4 pillars */}
      <section className="py-24 md:py-32 bg-paper">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
              Why Polaris
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-light tracking-tight text-navy-950">
              A structured path,<br />designed around you.
            </h2>
            <p className="mt-6 text-lg text-navy-700 leading-relaxed">
              We combine four pillars across every stage of your journey, so
              you arrive at the interview ready, confident and well-positioned.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group relative bg-white border border-navy-100 rounded-2xl p-8 hover:border-navy-300 hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-navy-50 text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-navy-950">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-navy-600 leading-relaxed">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* THREE CARDS — opportunities / events / advice */}
      <section className="py-24 md:py-32 bg-sand-50">
        <Container>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                Everything you need
              </p>
              <h2 className="mt-3 text-4xl md:text-5xl font-light tracking-tight text-navy-950">
                Opportunities, events and<br />advice — in one place.
              </h2>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              href="/opportunities"
              icon={Briefcase}
              eyebrow="Live jobs"
              title="Graduate roles & internships"
              text="Curated opportunities across finance, consulting, tech, law and more — updated daily."
              cta="Browse opportunities"
            />
            <FeatureCard
              href="/events"
              icon={Calendar}
              eyebrow="What's on"
              title="Workshops, talks and panels"
              text="Hear directly from senior professionals and recruiters. Online and in-person events."
              cta="See upcoming events"
            />
            <FeatureCard
              href="/advice"
              icon={BookOpen}
              eyebrow="Career advice"
              title="Insights from the inside"
              text="Practical guides on CVs, interviews, assessment centres and sector-specific know-how."
              cta="Read the latest"
            />
          </div>
        </Container>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 md:py-32 bg-paper">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                Where we work
              </p>
              <h2 className="mt-3 text-4xl md:text-5xl font-light tracking-tight text-navy-950">
                Eight sectors. One trusted partner.
              </h2>
              <p className="mt-6 text-lg text-navy-700 leading-relaxed">
                Our mentors are senior practitioners across the industries our
                members target most. They&apos;ve hired graduates — and they
                know what it takes to stand out.
              </p>
              <ButtonLink href="/services" variant="primary" size="md" className="mt-8">
                Explore our services <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {siteConfig.industries.map((ind) => (
                  <li
                    key={ind}
                    className="group flex items-center gap-3 px-5 py-4 rounded-xl border border-navy-100 bg-white hover:bg-navy-950 hover:text-white transition-colors cursor-default"
                  >
                    <Building2 className="h-5 w-5 text-sand-500 group-hover:text-sand-300" />
                    <span className="text-sm font-medium">{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy-950 text-white">
        <Container className="py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight">
                Ready to navigate<br />your success?
              </h2>
              <p className="mt-6 text-lg text-navy-100 max-w-lg">
                Tell us about your goals in under five minutes — a mentor
                will be in touch within five working days.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <ButtonLink href="/join#form" variant="secondary" size="lg">
                Get in touch <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function FeatureCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  text,
  cta,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-8 border border-navy-100 hover:border-navy-900 hover:shadow-xl transition-all flex flex-col"
    >
      <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-navy-950 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-6 text-xs uppercase tracking-widest text-sand-700 font-semibold">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-medium text-navy-950 tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-navy-600 leading-relaxed flex-1">{text}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-900 group-hover:gap-3 transition-all">
        {cta} <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
