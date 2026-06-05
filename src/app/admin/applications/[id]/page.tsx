import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusPill } from "../../page";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateApplication, deleteApplication } from "../actions";
import { SavedBanner } from "../../saved-banner";
import {
  nationalities,
  sectors,
  degreeLevels,
  programmes,
  careerStages,
  startTimings,
  experienceLevels,
  referralSources,
} from "@/lib/data/options";

export const metadata = { title: "Admin · Application" };

type Params = Promise<{ id: string }>;
type Search = Promise<{ saved?: string }>;

const STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "WON", "LOST", "ARCHIVED"];

const PREFERRED_LOCATIONS = [
  "London",
  "Manchester",
  "Birmingham",
  "Bristol",
  "Edinburgh",
  "Leeds",
  "Other UK",
  "Hong Kong",
  "Shanghai",
  "Singapore",
  "Open / flexible",
];

// Graduation year dropdown values for the admin edit form — current year
// back 20, plus "Still studying" for current students.
const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = [
  "Still studying",
  ...Array.from({ length: 21 }, (_, i) => String(CURRENT_YEAR - i)),
];

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) notFound();

  const fmtDate = (d: Date) =>
    d.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 max-w-6xl">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All applications
      </Link>

      {saved && <SavedBanner />}

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
            <Grid>
              <Field label="First name" name="firstName" defaultValue={app.firstName} required />
              <Field label="Last name" name="lastName" defaultValue={app.lastName} required />
              <Field label="Email" name="email" type="email" defaultValue={app.email} required />
              <Field label="Phone" name="phone" type="tel" defaultValue={app.phone} required />
              <Field label="Current city" name="city" defaultValue={app.city ?? ""} placeholder="e.g. London" />
              <Select
                label="Where from"
                name="nationality"
                defaultValue={app.nationality ?? ""}
                options={nationalities}
              />
            </Grid>
          </Section>

          <Section title="Education">
            <Grid>
              <Select
                label="Education level"
                name="degreeLevel"
                defaultValue={app.degreeLevel ?? ""}
                options={degreeLevels}
              />
              <Field
                label="University"
                name="university"
                defaultValue={app.university ?? ""}
                placeholder="e.g. University of Warwick"
              />
              <Field
                label="Course / major"
                name="course"
                defaultValue={app.course ?? ""}
              />
              <Select
                label="Graduation year"
                name="graduationYear"
                defaultValue={app.graduationYear ? String(app.graduationYear) : ""}
                options={GRAD_YEARS}
              />
              <Select
                label="Prior experience"
                name="experienceLevel"
                defaultValue={app.experienceLevel ?? ""}
                options={experienceLevels}
              />
              <Field
                label="LinkedIn"
                name="linkedin"
                defaultValue={app.linkedin ?? ""}
                placeholder="https://linkedin.com/in/…"
              />
            </Grid>
          </Section>

          <Section title="Career direction">
            <Grid>
              <Select
                label="Career stage"
                name="careerStage"
                defaultValue={app.careerStage ?? ""}
                options={careerStages}
              />
              <Select
                label="Start timing"
                name="startTiming"
                defaultValue={app.startTiming ?? ""}
                options={startTimings}
              />
            </Grid>
            <ChipPicker
              label="Target sectors"
              name="targetSectors"
              options={sectors}
              defaultValues={app.targetSectors}
            />
            <ChipPicker
              label="Preferred locations"
              name="preferredLocations"
              options={PREFERRED_LOCATIONS}
              defaultValues={app.preferredLocations}
            />
            <Select
              label="Programme of interest"
              name="programme"
              defaultValue={app.programme ?? ""}
              options={programmes}
            />
          </Section>

          <Section title="Their words">
            <Textarea
              label="Notes from applicant"
              name="notes"
              defaultValue={app.notes ?? ""}
              rows={6}
              hint="Includes the open-text answers from steps 4 and 5 of the join form."
            />
          </Section>

          <Section title="Source & consent">
            <Grid>
              <Select
                label="Heard about Polaris via"
                name="source"
                defaultValue={app.source ?? ""}
                options={referralSources}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-navy-900">
                  Consent
                </label>
                <div className="text-sm text-navy-700">
                  Privacy policy:{" "}
                  <strong className="text-navy-950">
                    {app.privacyAccepted ? "Accepted" : "Not accepted"}
                  </strong>
                  <span className="ml-1 text-xs text-navy-400">(legal record, read-only)</span>
                </div>
                <label className="flex items-center gap-2 text-sm text-navy-700">
                  <input
                    type="checkbox"
                    name="marketingOptIn"
                    defaultChecked={app.marketingOptIn}
                    className="h-4 w-4 rounded border-navy-300 text-navy-900"
                  />
                  Opted in to marketing emails
                </label>
              </div>
            </Grid>
          </Section>
        </div>

        <aside>
          <div className="bg-white border border-navy-100 rounded-2xl p-5 lg:sticky lg:top-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-navy-900 font-semibold">
              Workflow
            </h3>
            <Select
              label="Status"
              name="status"
              defaultValue={app.status}
              options={STATUSES}
            />
            <Field
              label="Assigned to"
              name="assignedTo"
              type="email"
              defaultValue={app.assignedTo ?? ""}
              placeholder="staff@polaris…"
            />
            <Textarea
              label="Internal notes"
              name="internalNotes"
              defaultValue={app.internalNotes ?? ""}
              rows={5}
              placeholder="What you talked about, follow-ups, anything…"
            />

            <SubmitButton
              variant="primary"
              size="md"
              className="w-full"
              pendingLabel="Saving…"
            >
              Save changes
            </SubmitButton>
            <p className="text-xs text-navy-500">
              Saves <em>everything</em> on this page — contact info, education,
              career direction, and the workflow fields above.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-navy-100 rounded-2xl p-6 space-y-5">
      <h2 className="text-xs uppercase tracking-widest text-navy-900 font-semibold">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1.5">
        {label} {required && <span className="text-sand-700">*</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 rounded-lg border border-navy-200 text-sm field-focus focus:outline-none focus:border-navy-900"
      />
    </div>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full h-10 px-3 rounded-lg border border-navy-200 text-sm bg-white field-focus focus:outline-none focus:border-navy-900"
      >
        <option value="">— Not set —</option>
        {options.map((o, i) =>
          o === "—" ? (
            <option key={`sep-${i}`} value="" disabled>
              ────────
            </option>
          ) : (
            <option key={o} value={o}>
              {o}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1.5">
        {label}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm field-focus focus:outline-none focus:border-navy-900"
      />
      {hint && <p className="mt-1 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}

function ChipPicker({
  label,
  name,
  options,
  defaultValues,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValues: string[];
}) {
  const set = new Set(defaultValues);
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={o}
              defaultChecked={set.has(o)}
              className="peer sr-only"
            />
            <span
              className={
                "inline-flex items-center gap-2 h-8 px-3 rounded-full border text-xs transition-colors " +
                "bg-white border-navy-200 text-navy-700 hover:bg-navy-50 " +
                "peer-checked:bg-sand-100 peer-checked:border-sand-400 peer-checked:text-navy-950 peer-checked:font-medium"
              }
            >
              {o}
            </span>
          </label>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-navy-500">
        Click chips to toggle. Multiple values allowed.
      </p>
    </div>
  );
}
