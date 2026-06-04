import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about where you want to go."
        subtitle="Drop us a message and we'll get back to you within one working day. Or come visit us at our London office."
      />

      <section className="py-20 md:py-28 bg-paper">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* INFO */}
            <div className="lg:col-span-4 space-y-6">
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

            {/* FORM */}
            <form className="lg:col-span-8 bg-white border border-navy-100 rounded-2xl p-8 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="First name" name="firstName" required />
                <Field label="Last name" name="lastName" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
              </div>

              <FieldSelect label="What can we help with?" name="topic">
                <option value="">Please select…</option>
                <option>I&apos;d like to join Polaris as a member</option>
                <option>Question about a specific programme</option>
                <option>Press / media enquiry</option>
                <option>Partnership / employer enquiry</option>
                <option>Something else</option>
              </FieldSelect>

              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 text-navy-900 focus:outline-none focus:border-navy-900"
                  required
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-navy-700">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-900"
                />
                <span>
                  I agree to Polaris Consulting&apos;s{" "}
                  <a href="/privacy" className="underline">
                    privacy policy
                  </a>{" "}
                  and consent to being contacted about my enquiry.
                </span>
              </label>

              <Button type="submit" variant="primary" size="lg">
                Send message
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">
        {label} {required && <span className="text-sand-700">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full h-11 px-4 rounded-xl border border-navy-200 text-navy-900 focus:outline-none focus:border-navy-900"
      />
    </div>
  );
}

function FieldSelect({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">
        {label}
      </label>
      <select
        name={name}
        className="w-full h-11 px-4 rounded-xl border border-navy-200 text-navy-900 bg-white focus:outline-none focus:border-navy-900"
      >
        {children}
      </select>
    </div>
  );
}
