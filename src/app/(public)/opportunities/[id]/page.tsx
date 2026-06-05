import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getJob } from "@/lib/jobs";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Opportunity not found" };
  return {
    title: `${job.jobTitle}${job.employerName ? ` · ${job.employerName}` : ""}`,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const fmtDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;
  const fmtSalary = (min: number | null, max: number | null, currency: string | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currency ?? "GBP",
        maximumFractionDigits: 0,
      }).format(n);
    if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}`;
    return fmt(max ?? min ?? 0);
  };

  const salary = fmtSalary(job.minSalary, job.maxSalary, job.currency);

  return (
    <section className="bg-paper py-12 md:py-16">
      <Container>
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950"
        >
          <ArrowLeft className="h-4 w-4" /> All opportunities
        </Link>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <article>
            <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold flex items-center gap-2 flex-wrap">
              <span>{job.sectors.join(" · ")}</span>
              {job.isChineseSpeaking && (
                <span className="px-2 py-0.5 rounded-full bg-royal-500/10 text-royal-600 text-[10px] tracking-wider normal-case font-medium">
                  Chinese-speaking
                </span>
              )}
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-navy-950 leading-tight">
              {job.jobTitle}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-navy-700">
              {job.employerName && (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-sand-500" />
                  <strong className="text-navy-950">{job.employerName}</strong>
                </span>
              )}
              {job.locationName && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sand-500" />
                  {job.locationName}
                </span>
              )}
            </div>

            <div className="mt-10 max-w-prose text-navy-700 leading-relaxed">
              <h2 className="text-xl font-medium text-navy-950 tracking-tight">
                About this opportunity
              </h2>
              <p className="mt-3 whitespace-pre-line">{job.description}</p>
              <p className="mt-6 text-sm text-navy-500">
                This is an excerpt from Reed. Click apply to see the full job
                description and submit your application on Reed.co.uk.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <ButtonLink href={job.jobUrl} variant="primary" size="lg">
                Apply on Reed <ExternalLink className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/join" variant="outline" size="lg">
                Get help applying <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-navy-100 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-navy-900 font-semibold">
                At a glance
              </h2>
              <ul className="space-y-3 text-sm">
                {salary && (
                  <Stat icon={Briefcase} label="Salary" value={salary} />
                )}
                {job.postedAt && (
                  <Stat
                    icon={Calendar}
                    label="Posted"
                    value={fmtDate(job.postedAt)!}
                  />
                )}
                {job.expirationDate && (
                  <Stat
                    icon={Calendar}
                    label="Closes"
                    value={fmtDate(job.expirationDate)!}
                  />
                )}
                {typeof job.applications === "number" && (
                  <Stat
                    icon={Users}
                    label="Applications so far"
                    value={String(job.applications)}
                  />
                )}
              </ul>

              <div className="pt-4 border-t border-navy-100">
                <p className="text-xs text-navy-500 leading-relaxed">
                  Polaris helps members prepare for roles like this through 1-to-1
                  mentoring, mock interviews, and assessment-centre practice.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-sand-500 shrink-0" />
      <div>
        <div className="text-xs text-navy-500">{label}</div>
        <div className="text-navy-900 font-medium">{value}</div>
      </div>
    </li>
  );
}
