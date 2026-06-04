"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { submitJoin } from "./actions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Link2,
  Lightbulb,
} from "lucide-react";
import {
  universities,
  degreeLevels,
  yearOfStudy,
  academicResults,
  sectors,
  programmes,
  referralSources,
  nationalities,
  cities,
  languages,
  careerStages,
  startTimings,
  experienceLevels,
} from "@/lib/data/options";

/**
 * Multi-step Join form.
 *
 * Goal: get the most information from each applicant by breaking the ask into
 * small, low-friction steps. Each step has 3–6 fields, microcopy explaining
 * *why* we ask, and a visible progress bar so people see the end is near.
 */

type FormState = {
  // Step 1 — Who you are
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  nationality: string;

  // Step 2 — Career direction
  careerStage: string;
  targetSectors: string[];
  startTiming: string;
  preferredLocations: string[];

  // Step 3 — Background
  degreeLevel: string;
  university: string;
  course: string;
  yearOfStudy: string;
  graduationYear: string;
  academicResult: string;
  spokenLanguages: string[];
  experienceLevel: string;
  linkedin: string;

  // Step 4 — The extra touches (optional, big impact)
  targetEmployers: string;
  proudOf: string;
  notes: string;

  // Step 5 — Final
  programme: string;
  source: string;
  cvFileName: string;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  nationality: "",
  careerStage: "",
  targetSectors: [],
  startTiming: "",
  preferredLocations: [],
  degreeLevel: "",
  university: "",
  course: "",
  yearOfStudy: "",
  graduationYear: "",
  academicResult: "",
  spokenLanguages: [],
  experienceLevel: "",
  linkedin: "",
  targetEmployers: "",
  proudOf: "",
  notes: "",
  programme: "",
  source: "",
  cvFileName: "",
  privacyAccepted: false,
  marketingOptIn: false,
};

const STEPS = [
  {
    n: 1,
    title: "Who you are",
    subtitle: "The basics — so a mentor can get in touch.",
  },
  {
    n: 2,
    title: "Where you're heading",
    subtitle: "Tell us about your career direction. Tick as many as apply.",
  },
  {
    n: 3,
    title: "Your background",
    subtitle:
      "Your education and experience. The more we know, the better we can match you.",
  },
  {
    n: 4,
    title: "Show us your spark",
    subtitle:
      "Optional, but applicants who share these things get matched 3× faster.",
  },
  {
    n: 5,
    title: "Final details",
    subtitle: "One more page and you're done.",
  },
] as const;

export function JoinForm() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which fields are non-empty to compute progress and reward completion.
  const filledCount = useMemo(() => countFilled(state), [state]);
  const totalAskable = TOTAL_ASKABLE;
  const progress = Math.min(100, Math.round((filledCount / totalAskable) * 100));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const toggleInArray = (key: keyof FormState, value: string) => {
    setState((s) => {
      const current = (s[key] as string[]) ?? [];
      const next = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];
      return { ...s, [key]: next };
    });
  };

  const canAdvance = stepIsValid(step, state);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitJoin(state);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong, please try again.";
      setError(msg);
      // Bring the user back to step 1 if it's a contact-field error.
      if (
        /name|email|phone|privacy/i.test(msg) &&
        step !== 5 &&
        step !== 1
      ) {
        setStep(1);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-navy-100 rounded-2xl p-10 md:p-14 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-sand-100 text-sand-700 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-3xl font-light text-navy-950 tracking-tight">
          Application received.
        </h2>
        <p className="mt-4 text-navy-700 leading-relaxed max-w-md mx-auto">
          A confirmation email is on its way. Our team will review your details
          and be in touch within five working days.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-50 text-navy-800 text-sm">
          <Lightbulb className="h-4 w-4 text-sand-600" />
          <span>
            Profile completeness: <strong>{progress}%</strong>
          </span>
        </div>
      </div>
    );
  }

  const current = STEPS[step - 1];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-navy-100 rounded-2xl p-7 md:p-10"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-navy-600 mb-2">
          <span className="uppercase tracking-widest font-semibold">
            Step {step} of {STEPS.length}
          </span>
          <span>
            Profile {progress}% complete{" "}
            {progress >= 80 && (
              <span className="text-sand-700">· you&apos;ll stand out</span>
            )}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-navy-100 overflow-hidden">
          <div
            className="h-full bg-navy-950 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex gap-1">
          {STEPS.map((s) => (
            <span
              key={s.n}
              className={
                "h-1 flex-1 rounded-full transition-colors " +
                (s.n < step
                  ? "bg-sand-400"
                  : s.n === step
                  ? "bg-navy-950"
                  : "bg-navy-100")
              }
            />
          ))}
        </div>
      </div>

      <div className="mb-7">
        <h2 className="text-2xl font-medium text-navy-950 tracking-tight">
          {current.title}
        </h2>
        <p className="mt-1.5 text-navy-600">{current.subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Step 1 ────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="First name"
              required
              value={state.firstName}
              onChange={(v) => update("firstName", v)}
            />
            <Field
              label="Last name"
              required
              value={state.lastName}
              onChange={(v) => update("lastName", v)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Email"
              type="email"
              required
              value={state.email}
              onChange={(v) => update("email", v)}
              hint="We&apos;ll send your confirmation here."
            />
            <Field
              label="Phone (incl. country code)"
              type="tel"
              required
              value={state.phone}
              onChange={(v) => update("phone", v)}
              hint="Used only for scheduling, not for marketing."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Current city"
              value={state.city}
              options={cities}
              onChange={(v) => update("city", v)}
            />
            <Select
              label="Nationality"
              value={state.nationality}
              options={nationalities}
              onChange={(v) => update("nationality", v)}
              hint="Helps us match you with mentors who know your background."
            />
          </div>
        </div>
      )}

      {/* ── Step 2 ────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-7">
          <RadioGroup
            label="Where are you in your journey?"
            value={state.careerStage}
            onChange={(v) => update("careerStage", v)}
            options={careerStages}
          />

          <ChipGroup
            label="Target sectors"
            hint="Pick any that interest you — even loosely."
            values={state.targetSectors}
            options={sectors}
            onToggle={(v) => toggleInArray("targetSectors", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="When do you want to start?"
              value={state.startTiming}
              options={startTimings}
              onChange={(v) => update("startTiming", v)}
            />
            <ChipGroup
              label="Preferred locations"
              hint="Multi-select"
              values={state.preferredLocations}
              options={["London", "UK — anywhere", "China", "Hong Kong", "Remote", "Other"]}
              onToggle={(v) => toggleInArray("preferredLocations", v)}
              compact
            />
          </div>
        </div>
      )}

      {/* ── Step 3 ────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Education level"
              required
              value={state.degreeLevel}
              options={degreeLevels}
              onChange={(v) => update("degreeLevel", v)}
            />
            <Select
              label="University"
              required
              value={state.university}
              options={universities}
              onChange={(v) => update("university", v)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Course / major"
              required
              value={state.course}
              onChange={(v) => update("course", v)}
            />
            <Select
              label="Year of study"
              required
              value={state.yearOfStudy}
              options={yearOfStudy}
              onChange={(v) => update("yearOfStudy", v)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Graduation year"
              type="number"
              value={state.graduationYear}
              onChange={(v) => update("graduationYear", v)}
            />
            <Select
              label="Academic result"
              value={state.academicResult}
              options={academicResults}
              onChange={(v) => update("academicResult", v)}
              hint="Predicted is fine if you haven&apos;t graduated."
            />
          </div>
          <ChipGroup
            label="Languages you speak"
            hint="Mentioning Mandarin / Cantonese unlocks the Chinese-speaking job feed."
            values={state.spokenLanguages}
            options={languages}
            onToggle={(v) => toggleInArray("spokenLanguages", v)}
          />
          <Select
            label="Prior work experience"
            value={state.experienceLevel}
            options={experienceLevels}
            onChange={(v) => update("experienceLevel", v)}
          />
          <Field
            label="LinkedIn profile (optional)"
            placeholder="https://linkedin.com/in/…"
            value={state.linkedin}
            onChange={(v) => update("linkedin", v)}
            hint="Your mentor will skim this before your first call."
            icon={Link2}
          />
        </div>
      )}

      {/* ── Step 4 ────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-sand-50 border border-sand-200 rounded-xl p-4 flex gap-3 text-sm text-sand-800">
            <Lightbulb className="h-5 w-5 text-sand-600 shrink-0 mt-0.5" />
            <p>
              These fields are <strong>optional</strong> — but applicants who
              fill them get matched with a mentor 3× faster, because we can see
              you&apos;re serious.
            </p>
          </div>

          <Textarea
            label="Which firms or roles inspire you most?"
            placeholder="e.g. Goldman Sachs IBD, McKinsey, Linklaters TC, Bain summer scheme…"
            value={state.targetEmployers}
            onChange={(v) => update("targetEmployers", v)}
            rows={3}
            hint="No pressure to be specific. Even sectors or types of work help."
          />

          <Textarea
            label="Tell us about something you're proud of"
            placeholder="A project, a competition, a part-time job, anything you put real effort into…"
            value={state.proudOf}
            onChange={(v) => update("proudOf", v)}
            rows={5}
            hint="A few sentences is plenty. This is the single highest-signal thing in your profile."
          />

          <Textarea
            label="Anything else we should know?"
            placeholder="Awards, scholarships, side projects, internships, specific concerns…"
            value={state.notes}
            onChange={(v) => update("notes", v)}
            rows={3}
          />
        </div>
      )}

      {/* ── Step 5 ────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-5">
          <Select
            label="Which programme are you interested in?"
            value={state.programme}
            options={programmes}
            onChange={(v) => update("programme", v)}
            hint="Not sure? Just say so — we&apos;ll advise."
          />

          <Select
            label="How did you hear about us?"
            value={state.source}
            options={referralSources}
            onChange={(v) => update("source", v)}
          />

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-2">
              Upload your CV{" "}
              <span className="text-navy-500 font-normal">
                (PDF, optional but recommended)
              </span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) update("cvFileName", f.name);
              }}
              className="block w-full text-sm text-navy-700 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-navy-50 file:text-navy-900 hover:file:bg-navy-100"
            />
            {state.cvFileName && (
              <p className="mt-2 text-xs text-navy-600 inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-sand-600" />
                {state.cvFileName} ready to upload
              </p>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-navy-100">
            <label className="flex items-start gap-3 text-sm text-navy-700">
              <input
                type="checkbox"
                checked={state.privacyAccepted}
                onChange={(e) => update("privacyAccepted", e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-900"
              />
              <span>
                I agree to Polaris Consulting&apos;s{" "}
                <a href="/privacy" className="underline">
                  privacy policy
                </a>{" "}
                and consent to my data being stored to process my application.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-navy-700">
              <input
                type="checkbox"
                checked={state.marketingOptIn}
                onChange={(e) => update("marketingOptIn", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-900"
              />
              <span>
                I&apos;d like to receive newsletters with new opportunities,
                events and advice.
              </span>
            </label>
          </div>

          <div className="pt-2 text-xs text-navy-500 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5" />
            Your information is encrypted in transit and only visible to the
            Polaris team.
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-navy-100 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-950"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span />
        )}

        {step < STEPS.length ? (
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!canAdvance}
            onClick={() => setStep(step + 1)}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting || !state.privacyAccepted}
          >
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
    </form>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  required = false,
  placeholder,
  hint,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">
        {label} {required && <span className="text-sand-700">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={
            "w-full h-11 px-4 rounded-xl border border-navy-200 text-navy-900 focus:outline-none focus:border-navy-900 " +
            (Icon ? "pl-9 " : "")
          }
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}

function Select({
  label,
  required = false,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">
        {label} {required && <span className="text-sand-700">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-11 px-4 rounded-xl border border-navy-200 text-navy-900 bg-white focus:outline-none focus:border-navy-900"
      >
        <option value="" disabled>
          Please select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1.5 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}

function Textarea({
  label,
  placeholder,
  hint,
  rows = 4,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  rows?: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const charCount = value.length;
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-navy-200 text-navy-900 focus:outline-none focus:border-navy-900"
      />
      <div className="mt-1.5 flex items-center justify-between text-xs text-navy-500">
        <span>{hint}</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  hint,
  values,
  options,
  onToggle,
  compact = false,
}: {
  label: string;
  hint?: string;
  values: string[];
  options: readonly string[];
  onToggle: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1">
        {label}
      </label>
      {hint && <p className="mb-3 text-xs text-navy-500">{hint}</p>}
      <div
        className={
          "flex flex-wrap gap-2 " + (compact ? "" : "")
        }
      >
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={
                "h-9 px-4 rounded-full text-sm font-medium border transition-colors " +
                (active
                  ? "bg-navy-950 text-white border-navy-950"
                  : "bg-white text-navy-700 border-navy-200 hover:border-navy-900")
              }
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-1 gap-2">
        {options.map((o) => {
          const selected = value === o;
          return (
            <button
              type="button"
              key={o}
              onClick={() => onChange(o)}
              className={
                "flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-colors " +
                (selected
                  ? "bg-navy-950 text-white border-navy-950"
                  : "bg-white text-navy-800 border-navy-200 hover:border-navy-900")
              }
            >
              <span
                className={
                  "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 " +
                  (selected
                    ? "border-sand-300 bg-sand-300"
                    : "border-navy-300")
                }
              >
                {selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-950" />
                )}
              </span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Logic helpers ────────────────────────────────────────────────

/**
 * Count non-empty fields across the whole form. Used for the "Profile X%
 * complete" indicator that nudges people to fill more.
 */
function countFilled(s: FormState): number {
  let n = 0;
  // strings
  for (const k of [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "nationality",
    "careerStage",
    "startTiming",
    "degreeLevel",
    "university",
    "course",
    "yearOfStudy",
    "graduationYear",
    "academicResult",
    "experienceLevel",
    "linkedin",
    "targetEmployers",
    "proudOf",
    "notes",
    "programme",
    "source",
    "cvFileName",
  ] as const) {
    if ((s[k] as string).trim()) n++;
  }
  // string[]
  for (const k of ["targetSectors", "preferredLocations", "spokenLanguages"] as const) {
    if ((s[k] as string[]).length) n++;
  }
  return n;
}

// Number of fields we ask in total — used to compute completeness %.
const TOTAL_ASKABLE = 25;

function stepIsValid(step: number, s: FormState): boolean {
  if (step === 1) {
    return Boolean(
      s.firstName && s.lastName && s.email && s.phone
    );
  }
  if (step === 3) {
    return Boolean(
      s.degreeLevel && s.university && s.course && s.yearOfStudy
    );
  }
  return true; // step 2, 4 have no required fields, step 5 enforced via submit
}
