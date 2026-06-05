"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Save, Eye } from "lucide-react";

type EventInitial = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  startsAt: string;
  endsAt: string;
  format: "ONLINE" | "IN_PERSON";
  location: string;
  sector: string | null;
  registrationUrl: string;
  published: boolean;
  createdAt?: string;
};

type Props = {
  initial?: EventInitial;
  isEdit?: boolean;
  action: (formData: FormData) => Promise<void> | void;
};

export function EventForm({ initial, isEdit, action }: Props) {
  const [state, setState] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    startsAt: initial?.startsAt?.slice(0, 16) ?? "",
    endsAt: initial?.endsAt?.slice(0, 16) ?? "",
    format: (initial?.format ?? "ONLINE") as "ONLINE" | "IN_PERSON",
    location: initial?.location ?? "",
    sector: initial?.sector ?? "",
    registrationUrl: initial?.registrationUrl ?? "",
    published: initial?.published ?? false,
  });

  function set<K extends keyof typeof state>(k: K, v: (typeof state)[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  /**
   * True when both start and end are filled in and the end is before
   * (or equal to) the start. Displayed under the inputs and blocks the
   * Save button so the user can't ship an event with broken timing.
   */
  const timeError =
    state.startsAt && state.endsAt && state.endsAt <= state.startsAt
      ? "End time must be after start time."
      : null;

  // Minimum to publish an event: title + slug + valid times. Otherwise
  // the publish toggle is forced off + disabled, so admin can't ship
  // an event with missing fields.
  const canPublish = !!(
    state.title.trim() &&
    state.slug.trim() &&
    state.startsAt &&
    state.endsAt &&
    !timeError
  );

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {isEdit && initial?.id && (
        <input type="hidden" name="id" value={initial.id} />
      )}

      <div className="space-y-6">
        <Section title="Basics">
          <Field label="Title" required>
            <input
              type="text"
              name="title"
              value={state.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!isEdit) set("slug", slugify(e.target.value));
              }}
              required
              className="w-full h-11 px-4 rounded-lg border border-navy-200 text-navy-900 field-focus focus:outline-none focus:border-navy-900"
            />
          </Field>
          <Field label="URL slug" hint="Lowercase letters, numbers, hyphens">
            <input
              type="text"
              name="slug"
              value={state.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-navy-200 text-navy-900 font-mono text-sm field-focus focus:outline-none focus:border-navy-900"
            />
            <p className="mt-1.5 text-xs text-navy-500">
              /events/<strong className="text-navy-700">{state.slug || "your-slug"}</strong>
            </p>
          </Field>
          <Field label="Excerpt" hint="One-sentence summary shown on the events list.">
            <input
              type="text"
              name="excerpt"
              value={state.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              maxLength={180}
              className="w-full h-11 px-4 rounded-lg border border-navy-200 text-navy-900 field-focus focus:outline-none focus:border-navy-900"
            />
          </Field>
        </Section>

        <Section title="When & where">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Starts at" required>
              <input
                type="datetime-local"
                name="startsAt"
                value={state.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
                required
                className={
                  "w-full h-11 px-4 rounded-lg border focus:outline-none " +
                  (timeError ? "border-red-300" : "border-navy-200 focus:border-navy-900")
                }
              />
            </Field>
            <Field label="Ends at" required>
              <input
                type="datetime-local"
                name="endsAt"
                value={state.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
                required
                min={state.startsAt || undefined}
                className={
                  "w-full h-11 px-4 rounded-lg border focus:outline-none " +
                  (timeError ? "border-red-300" : "border-navy-200 focus:border-navy-900")
                }
              />
            </Field>
          </div>
          {timeError && (
            <p className="text-sm text-red-600 -mt-2">⚠ {timeError}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Format">
              <select
                name="format"
                value={state.format}
                onChange={(e) => set("format", e.target.value as typeof state.format)}
                className="w-full h-11 px-4 rounded-lg border border-navy-200 bg-white field-focus focus:outline-none focus:border-navy-900"
              >
                <option value="ONLINE">Online</option>
                <option value="IN_PERSON">In person</option>
              </select>
            </Field>
            <Field label="Sector tag (optional)">
              <select
                name="sector"
                value={state.sector ?? ""}
                onChange={(e) => set("sector", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-navy-200 bg-white field-focus focus:outline-none focus:border-navy-900"
              >
                <option value="">— No tag —</option>
                {["Finance", "Accounting", "Consulting", "Engineering", "Law", "Marketing"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Location" hint='"Zoom" or a venue address.'>
            <input
              type="text"
              name="location"
              value={state.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-navy-200 field-focus focus:outline-none focus:border-navy-900"
            />
          </Field>
        </Section>

        <Section title="Description">
          <Field label="Body (Markdown supported)">
            <textarea
              name="body"
              value={state.body}
              onChange={(e) => set("body", e.target.value)}
              rows={16}
              placeholder="## What we'll cover&#10;- Topic 1&#10;- Topic 2&#10;&#10;Bring …"
              className="w-full px-4 py-3 rounded-lg border border-navy-200 font-mono text-sm field-focus focus:outline-none focus:border-navy-900"
            />
          </Field>
        </Section>

        <Section title="Registration">
          <Field label="External registration URL" hint="Leave blank if there's no third-party signup yet — no Register button will be shown.">
              <input
                type="url"
                name="registrationUrl"
                value={state.registrationUrl}
                onChange={(e) => set("registrationUrl", e.target.value)}
                placeholder="https://www.eventbrite…"
                className="w-full h-11 px-4 rounded-lg border border-navy-200 field-focus focus:outline-none focus:border-navy-900"
              />
            </Field>
        </Section>
      </div>

      <aside className="space-y-4">
        <div className="bg-white border border-navy-100 rounded-2xl p-5 lg:sticky lg:top-6">
          <h3 className="text-xs uppercase tracking-widest text-navy-900 font-semibold mb-4">
            Publish
          </h3>
          <label className="flex items-center gap-3 mb-1">
            <input
              type="checkbox"
              name="published"
              checked={state.published && canPublish}
              disabled={!canPublish}
              onChange={(e) => set("published", e.target.checked)}
              className="h-4 w-4 rounded border-navy-300 text-navy-900 disabled:opacity-40"
            />
            <span
              className={
                "text-sm " + (canPublish ? "text-navy-900" : "text-navy-400")
              }
            >
              {state.published && canPublish
                ? "Published — visible on public site"
                : "Draft — admin only"}
            </span>
          </label>
          {!canPublish ? (
            <p className="text-xs text-navy-400 mb-5 ml-7">
              Fill in title, slug, and valid start/end times to enable publishing.
            </p>
          ) : (
            <div className="mb-5" />
          )}

          <SubmitButton
            variant="primary"
            size="md"
            className="w-full"
            disabled={!!timeError}
            pendingLabel="Saving…"
          >
            <Save className="h-4 w-4" />
            {isEdit ? "Save changes" : "Create event"}
          </SubmitButton>

          {state.published && state.slug && (
            <a
              href={`/events/${state.slug}`}
              target="_blank"
              rel="noopener"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-navy-200 text-sm font-medium hover:bg-navy-50"
            >
              <Eye className="h-4 w-4" /> View public page
            </a>
          )}
        </div>

      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-navy-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-navy-900 font-semibold">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-2">
        {label} {required && <span className="text-sand-700">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}
