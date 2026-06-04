import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "About" };

const values = [
  {
    title: "Executive-level mentors",
    text: "Senior professionals with 20+ years of experience across the UK, US and China — offering personalised career planning and sector-specific insight.",
  },
  {
    title: "Extensive recruitment networks",
    text: "Partnerships with headhunters and international employers, plus regular networking events to expand your professional circle.",
  },
  {
    title: "Real-world interview practice",
    text: "Advanced practice with recruiters from prestigious firms, with targeted feedback on communication style and skills alignment.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Helping ambitious graduates secure the roles that matter."
        subtitle="Polaris Consulting is a London-based career firm. We exist to give people entering the world of work the guidance, network and preparation they need to thrive."
      />

      <section className="py-20 md:py-28 bg-paper">
        <Container className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            Our background
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950 leading-tight">
            Entering the world of work is the start of an exciting new chapter.
          </h2>
          <div className="mt-6 prose prose-lg max-w-none text-navy-700 space-y-5 leading-relaxed">
            <p>
              For many people, that step is daunting. The seemingly endless set
              of options can be overwhelming. Where do you start? What should
              you focus on? Up until this point, most people have been
              surrounded by teachers and mentors who guide them through
              difficult choices.
            </p>
            <p>
              Once you leave the classroom, that scaffolding falls away — yet
              the decisions get bigger. Professional guidance around securing
              the role of your dreams has been challenging to find. We think it
              shouldn&apos;t be.
            </p>
            <p>
              Polaris is named after the North Star. For thousands of years
              navigators have used it to find their way. In China, Polaris is
              known as Ziwei — the Emperor Star, symbolising nobility and
              fortune. We believe building your career is its own kind of
              journey, and you need a constant point of reference.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-sand-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                What we believe
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950">
                Our core values
              </h2>
            </div>
            <ul className="lg:col-span-8 space-y-6">
              {values.map((v, i) => (
                <li
                  key={v.title}
                  className="flex gap-6 bg-white rounded-2xl p-7 border border-navy-100"
                >
                  <div className="text-3xl font-light text-sand-500 leading-none w-10 shrink-0">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-navy-950 tracking-tight">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-navy-700 leading-relaxed">
                      {v.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-paper">
        <Container className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            Our mission
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-navy-950">
            Help you realise your professional potential — equipped to thrive.
          </h2>
          <p className="mt-6 text-lg text-navy-700 leading-relaxed">
            We do this through a team of seasoned mentors and professional
            advisors across multiple industries — many holding senior management
            positions at some of the world&apos;s best-known organisations. We
            back this up with our employer network, each looking for the talent
            they need to grow.
          </p>
          <div className="mt-10">
            <ButtonLink href="/services" variant="primary" size="lg">
              See how it works <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
