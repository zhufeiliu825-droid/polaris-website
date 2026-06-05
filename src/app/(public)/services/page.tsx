import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, Check, Download } from "lucide-react";

export const metadata = {
  title: "Services",
  description:
    "A structured six-stage careers programme — from psychometric assessment and career planning to mock interviews and post-offer support — across three depths of support.",
  alternates: { canonical: "/services" },
};

const stages = [
  {
    n: 1,
    title: "Consultation",
    text: "Through discussion with a dedicated consultant, we agree on which courses and packages best meet your needs, and tailor a programme around you.",
  },
  {
    n: 2,
    title: "Psychometric assessment",
    text: "An online psychometric assessment with our occupational psychologist helps you understand your strengths and the roles best suited to you.",
  },
  {
    n: 3,
    title: "Career planning",
    text: "Working with a Career Planning mentor, you build a more detailed picture of the type of role and sector that suits you, and formulate a strategy.",
  },
  {
    n: 4,
    title: "Industry-specific training",
    text: "An Industry Mentor walks you through the realities of your chosen sector: networking, online presence, application processes and interview prep.",
  },
  {
    n: 5,
    title: "Interview simulation",
    text: "We run practice interviews, group discussions, case analyses and assessment centres — with feedback from experienced recruitment professionals.",
  },
  {
    n: 6,
    title: "Post-offer support",
    text: "After you receive an offer, we help you evaluate it, prepare for transition, and build the soft skills you need to thrive in your new role.",
  },
];

const programs = [
  {
    name: "Acceleration",
    duration: "6 months",
    hours: "15 h",
    target: "For final-year students or graduates who have just left education. Highly customised modular courses to achieve a quick sprint.",
    accent: "bg-sand-100 text-sand-800",
  },
  {
    name: "VIP",
    duration: "12 months",
    hours: "25 h",
    target: "For students who want to define long-term career plans. Build high-quality recruitment knowledge, improve capability and position yourself for an internship or first role.",
    accent: "bg-royal-500/10 text-royal-600",
    featured: true,
  },
  {
    name: "Elite",
    duration: "24–36 months",
    hours: "TBC",
    target: "For students who want deeper support across all aspects of their career development, accessing Polaris's senior mentor team throughout the journey.",
    accent: "bg-navy-100 text-navy-800",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="A structured six-stage programme — built around you."
        subtitle="From self-awareness to post-offer support, we accompany you through every phase of getting hired and getting ahead."
      />

      {/* PROGRAMS — anchor for "Enquire" CTAs from elsewhere and the
          landing target for /services itself. */}
      <section id="programmes" className="py-20 md:py-28 bg-paper scroll-mt-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
              Programmes
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950">
              Three depths of support. One outcome.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div
                key={p.name}
                className={
                  "relative flex flex-col bg-white rounded-2xl p-8 border " +
                  (p.featured
                    ? "border-navy-900 shadow-xl"
                    : "border-navy-100")
                }
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-navy-950 text-white text-xs font-semibold uppercase tracking-widest">
                    Most popular
                  </span>
                )}
                <p
                  className={
                    "inline-flex w-fit px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold " +
                    p.accent
                  }
                >
                  {p.name} Programme
                </p>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-4xl font-light text-navy-950">
                    {p.duration}
                  </span>
                  <span className="text-sm text-navy-500">{p.hours}</span>
                </div>
                <p className="mt-5 text-navy-700 leading-relaxed flex-1">
                  {p.target}
                </p>
                <ButtonLink
                  href="/join#form"
                  variant={p.featured ? "primary" : "outline"}
                  size="md"
                  className="mt-8"
                >
                  Enquire <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* BROCHURES */}
      <section className="pb-20 md:pb-28 bg-paper">
        <Container>
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
              Brochures
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950">
              Take the full Polaris story with you.
            </h2>
            <p className="mt-4 text-navy-600 leading-relaxed">
              The complete 21-page programme guide — covering our six-stage
              process, programmes, mentors, and case studies — in either
              English or Chinese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {[
              {
                href: "/brochures/polaris-intro-en.pdf",
                lang: "English · PDF",
                title: "Polaris programme guide",
              },
              {
                href: "/brochures/polaris-intro-zh.pdf",
                lang: "中文 · PDF",
                title: "Polaris 项目介绍",
              },
            ].map((b) => (
              <a
                key={b.href}
                href={b.href}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-4 bg-white border border-navy-100 rounded-2xl p-6 hover:border-navy-900 hover:shadow-md transition-all"
              >
                <div className="shrink-0 h-12 w-12 rounded-xl bg-sand-100 text-sand-700 flex items-center justify-center">
                  <Download className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                    {b.lang}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-navy-950 group-hover:text-navy-700">
                    {b.title}
                  </h3>
                </div>
                <ArrowRight className="h-5 w-5 text-navy-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* SIX-STAGE PROCESS */}
      <section className="py-20 md:py-28 bg-sand-50">
        <Container>
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
              The process
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950">
              Six stages from where you are to where you want to be.
            </h2>
          </div>

          <ol className="space-y-4 max-w-4xl">
            {stages.map((s) => (
              <li
                key={s.n}
                className="group flex gap-6 bg-white rounded-2xl p-7 border border-navy-100 hover:border-navy-900 transition-colors"
              >
                <div className="shrink-0">
                  <div className="h-12 w-12 rounded-full bg-navy-950 text-white flex items-center justify-center font-medium">
                    {String(s.n).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-navy-950 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-navy-700 leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* INCLUDED */}
      <section className="py-20 md:py-28 bg-paper">
        <Container className="max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            What&apos;s included
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950">
            Across every programme, you get:
          </h2>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Personal mentor matched to your sector",
              "Thomas International psychometric assessment",
              "CV and cover letter coaching",
              "LinkedIn profile development",
              "Mock interviews with recruiters",
              "Case study and competency drills",
              "Assessment-centre simulation",
              "Networking events with senior leaders",
              "Polaris Elite Club alumni access",
              "Post-offer transition support",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-navy-800"
              >
                <Check className="h-5 w-5 text-sand-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
