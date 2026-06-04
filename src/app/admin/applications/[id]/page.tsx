import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Briefcase, Link2, FileText, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusPill } from "../../page";
import { Button } from "@/components/ui/button";
import { updateApplication, deleteApplication } from "../actions";

export const metadata = { title: "Admin · Application" };

type Params = Promise<{ id: string }>;

export default async function ApplicationDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) notFound();

  const fmtDate = (d: Date) =>
    d.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="px-8 py-10 max-w-5xl">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All applications
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
        <div className="flex items-start gap-5">
          <div className="h-14 w-14 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center font-medium text-lg shrink-0">
            {app.firstName[0]}
            {app.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-navy-950">
              {app.firstName} {app.lastName}
            </h1>
            <p className="mt-1 text-navy-600">
              Submitted {fmtDate(app.createdAt)}
            </p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <StatusPill status={app.status} />
              {app.assignedTo && (
                <span className="text-xs text-navy-600">
                  Owner: <strong>{app.assignedTo}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
        <form action={deleteApplication}>
          <input type="hidden" name="id" value={app.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </form>
      </div>

      <form
        action={updateApplication}
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8"
      >
        <input type="hidden" name="id" value={app.id} />

        <div className="space-y-6">
          <Section title="Contact">
            <Row icon={Mail} label="Email" value={app.email} link={`mailto:${app.email}`} />
            <Row icon={Phone} label="Phone" value={app.phone} link={`tel:${app.phone.replace(/\s/g, "")}`} />
            <Row icon={MapPin} label="Location" value={`${app.city ?? ""}${app.nationality ? ", " + app.nationality : ""}`} />
          </Section>

          <Section title="Education">
            <Row icon={GraduationCap} label="University" value={app.university} />
            <Row label="Course" value={app.course} />
            <Row label="Year" value={app.yearOfStudy} />
            <Row label="Graduation year" value={app.graduationYear ? String(app.graduationYear) : null} />
            <Row label="Academic result" value={app.academicResult} />
          </Section>

          <Section title="Goals">
            <Row label="Target sectors" value={app.targetSectors.join(", ")} />
            <Row icon={Briefcase} label="Programme of interest" value={app.programme} />
            <Row label="Source" value={app.source} />
          </Section>

          {app.notes && (
            <Section title="Their words">
              <p className="text-navy-800 leading-relaxed whitespace-pre-line">
                {app.notes}
              </p>
            </Section>
          )}

          {app.cvUrl && (
            <Section title="CV">
              <a
                href={app.cvUrl}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-navy-200 hover:border-navy-900 bg-white text-sm font-medium text-navy-900"
              >
                <FileText className="h-4 w-4" /> Download CV
              </a>
            </Section>
          )}
        </div>

        <aside>
          <div className="bg-white border border-navy-100 rounded-2xl p-5 lg:sticky lg:top-6">
            <h3 className="text-xs uppercase tracking-widest text-navy-900 font-semibold mb-4">
              Workflow
            </h3>
            <div className="space-y-4">
              <FieldEdit label="Status" name="status">
                <select
                  name="status"
                  defaultValue={app.status}
                  className="w-full h-10 px-3 rounded-lg border border-navy-200 text-sm focus:outline-none focus:border-navy-900 bg-white"
                >
                  {["NEW", "CONTACTED", "IN_PROGRESS", "WON", "LOST", "ARCHIVED"].map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </FieldEdit>
              <FieldEdit label="Assigned to" name="assignedTo">
                <input
                  name="assignedTo"
                  type="email"
                  defaultValue={app.assignedTo ?? ""}
                  placeholder="staff@polaris..."
                  className="w-full h-10 px-3 rounded-lg border border-navy-200 text-sm focus:outline-none focus:border-navy-900"
                />
              </FieldEdit>
              <FieldEdit label="Internal notes" name="internalNotes">
                <textarea
                  name="internalNotes"
                  defaultValue={app.internalNotes ?? ""}
                  rows={5}
                  placeholder="What you talked about, follow-ups, anything…"
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:outline-none focus:border-navy-900"
                />
              </FieldEdit>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Save changes
              </Button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-navy-100 rounded-2xl p-6">
      <h2 className="text-xs uppercase tracking-widest text-navy-900 font-semibold mb-4">
        {title}
      </h2>
      <dl className="space-y-3">{children}</dl>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
  link?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <Icon className="h-4 w-4 text-sand-500 mt-0.5 shrink-0" />
      ) : (
        <span className="w-4 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <dt className="text-xs text-navy-500">{label}</dt>
        <dd className="text-navy-900 break-words">
          {link ? <a href={link} className="hover:underline">{value}</a> : value}
        </dd>
      </div>
    </div>
  );
}

function FieldEdit({ label, name, children }: { label: string; name: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs text-navy-700 font-medium mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
