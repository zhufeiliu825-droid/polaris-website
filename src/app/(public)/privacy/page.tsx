import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Privacy policy",
  description:
    "How Polaris Consulting collects, uses, stores and protects your personal data.",
};

// Bump this when the policy materially changes.
const LAST_UPDATED = "June 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        subtitle={`How we collect, use and protect your personal data. Last updated ${LAST_UPDATED}.`}
      />

      <section className="py-16 md:py-20 bg-paper">
        <Container className="max-w-3xl">
          <div className="space-y-10 text-navy-800 leading-relaxed">
            <Block title="1. Who we are">
              <p>
                This site is operated by <strong>Polaris Consulting Ltd</strong>{" "}
                (&ldquo;Polaris&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a
                careers consultancy based at {siteConfig.contact.address.line1},{" "}
                {siteConfig.contact.address.line2}. We are the data controller
                responsible for your personal data. If you have any questions
                about this policy, contact us at{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-navy-900 underline underline-offset-2"
                >
                  {siteConfig.contact.email}
                </a>
                .
              </p>
            </Block>

            <Block title="2. What data we collect">
              <p>When you submit our contact form, we collect:</p>
              <List
                items={[
                  "Your name, email address and phone number",
                  "Your current city and where you are from",
                  "Education details — university, course, education level and graduation year",
                  "Career information — target sectors, preferred locations, prior experience, LinkedIn profile and the programme you're interested in",
                  "Anything else you choose to tell us in the free-text fields",
                  "Whether you have opted in to marketing emails",
                ]}
              />
              <p>
                We do not collect special-category data (such as health,
                ethnicity or religious beliefs) and ask that you do not include
                it in the free-text fields.
              </p>
            </Block>

            <Block title="3. How we use your data">
              <p>We use your personal data to:</p>
              <List
                items={[
                  "Respond to your enquiry and match you with a suitable mentor and programme",
                  "Recommend opportunities, events and advice relevant to your goals",
                  "Send you a confirmation that we've received your enquiry",
                  "Send marketing emails — only if you have opted in, and you can unsubscribe at any time",
                ]}
              />
              <p>
                Our lawful basis for processing is your{" "}
                <strong>consent</strong> (which you give by submitting the form
                and ticking the consent box) and our{" "}
                <strong>legitimate interest</strong> in providing the careers
                service you have asked about.
              </p>
            </Block>

            <Block title="4. Who we share it with">
              <p>
                We never sell your data. We share it only with the service
                providers that help us run this site, each of which processes
                data on our instructions under a data-processing agreement:
              </p>
              <List
                items={[
                  "Supabase — our database, hosted in the EU/UK (London region)",
                  "Resend — to send the confirmation and any emails you've opted into",
                  "Vercel — website hosting",
                ]}
              />
              <p>
                Job listings shown on the Opportunities page come from a
                read-only feed provided by Reed.co.uk. We do not send your
                personal data to Reed.
              </p>
            </Block>

            <Block title="5. How long we keep it">
              <p>
                We keep your enquiry for as long as we are in active contact
                with you and for a reasonable period afterwards in case you
                return. You can ask us to delete your data at any time (see your
                rights below), and we will do so unless we are legally required
                to keep it.
              </p>
            </Block>

            <Block title="6. Your rights">
              <p>Under UK data-protection law you have the right to:</p>
              <List
                items={[
                  "Access the personal data we hold about you",
                  "Ask us to correct anything that's inaccurate",
                  "Ask us to delete your data",
                  "Object to or restrict how we use it",
                  "Withdraw your consent at any time",
                ]}
              />
              <p>
                To exercise any of these, email us at{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-navy-900 underline underline-offset-2"
                >
                  {siteConfig.contact.email}
                </a>
                . If you are unhappy with how we handle your data, you can
                complain to the UK&apos;s Information Commissioner&apos;s Office
                (ICO) at{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener"
                  className="text-navy-900 underline underline-offset-2"
                >
                  ico.org.uk
                </a>
                .
              </p>
            </Block>

            <Block title="7. Cookies">
              <p>
                We do not use advertising or third-party tracking cookies. The
                only cookie we set is a secure session cookie, used solely to
                keep Polaris staff signed in to the admin area — it is never set
                for ordinary visitors.
              </p>
            </Block>

            <Block title="8. Changes to this policy">
              <p>
                We may update this policy from time to time. The date at the top
                of this page shows when it was last revised. Material changes
                will be reflected here before they take effect.
              </p>
            </Block>

            <div className="pt-6 border-t border-navy-100">
              <Link
                href="/contact"
                className="text-navy-900 underline underline-offset-2"
              >
                Questions? Get in touch →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium text-navy-950 tracking-tight mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-navy-700">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}
