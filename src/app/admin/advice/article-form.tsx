"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Eye, Trash2, FileText, Pencil } from "lucide-react";
import { Markdown } from "@/components/markdown";
type ArticleInitial = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  readMinutes: number;
  authorName: string;
  published: boolean;
  publishedAt: string | null;
  isFeatured: boolean;
  createdAt: string;
};

const CATEGORIES = [
  "Applications",
  "Interviews",
  "Assessment",
  "Industry insights",
  "Working life",
];

type Props = {
  initial?: ArticleInitial;
  isEdit?: boolean;
  action: (formData: FormData) => Promise<void> | void;
  deleteAction?: (formData: FormData) => Promise<void> | void;
};

export function ArticleForm({ initial, isEdit, action, deleteAction }: Props) {
  const [state, setState] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    category: initial?.category ?? "Applications",
    tags: initial?.tags.join(", ") ?? "",
    readMinutes: initial?.readMinutes ? String(initial.readMinutes) : "5",
    authorName: initial?.authorName ?? "Polaris team",
    published: initial?.published ?? false,
    isFeatured: initial?.isFeatured ?? false,
  });
  const [tab, setTab] = useState<"write" | "preview">("write");

  function set<K extends keyof typeof state>(k: K, v: (typeof state)[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Compute reading time from body (~200 words/min) — useful nudge.
  const words = useMemo(
    () => state.body.trim().split(/\s+/).filter(Boolean).length,
    [state.body]
  );
  const computedMinutes = Math.max(1, Math.round(words / 200));

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {isEdit && initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="space-y-6">
        <Section title="Headline">
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
              className="w-full h-12 px-4 rounded-lg border border-navy-200 text-lg text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="Writing a finance CV that passes the 15-second test"
            />
          </Field>
          <Field label="URL slug">
            <input
              type="text"
              name="slug"
              value={state.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-navy-200 font-mono text-sm focus:outline-none focus:border-navy-900"
            />
            <p className="mt-1.5 text-xs text-navy-500">
              /advice/<strong className="text-navy-700">{state.slug || "your-slug"}</strong>
            </p>
          </Field>
          <Field label="Excerpt" hint="A one-sentence hook shown on cards.">
            <textarea
              name="excerpt"
              value={state.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              maxLength={220}
              className="w-full px-4 py-3 rounded-lg border border-navy-200 focus:outline-none focus:border-navy-900"
            />
            <p className="mt-1.5 text-xs text-navy-500 text-right">
              {state.excerpt.length}/220
            </p>
          </Field>
        </Section>

        <Section title="Content">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium " +
                (tab === "write"
                  ? "bg-navy-950 text-white"
                  : "bg-white border border-navy-200 text-navy-700 hover:bg-navy-50")
              }
            >
              <Pencil className="h-3.5 w-3.5" /> Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium " +
                (tab === "preview"
                  ? "bg-navy-950 text-white"
                  : "bg-white border border-navy-200 text-navy-700 hover:bg-navy-50")
              }
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <span className="ml-auto text-xs text-navy-500">
              {words} words · ~{computedMinutes} min read
            </span>
          </div>

          {/* The body textarea is rendered even when "Preview" is active so it
              still submits with the form. We hide it via CSS instead of unmounting. */}
          <textarea
            name="body"
            value={state.body}
            onChange={(e) => set("body", e.target.value)}
            rows={24}
            placeholder={`# Your headline\n\nFirst paragraph hooks the reader…\n\n## A sub-heading\n\n- A point\n- Another point\n\nLink: [Polaris](https://polarisconsulting.uk)`}
            className={
              "w-full px-4 py-4 rounded-lg border border-navy-200 font-mono text-sm leading-relaxed focus:outline-none focus:border-navy-900 " +
              (tab === "write" ? "" : "hidden")
            }
          />
          {tab === "preview" && (
            <div className="rounded-lg border border-navy-200 bg-navy-50/40 px-6 py-5 min-h-[500px]">
              {state.body.trim() ? (
                <Markdown markdown={state.body} />
              ) : (
                <p className="text-sm text-navy-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Start writing to see the preview.
                </p>
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-navy-500">
            Markdown supported: <code>**bold**</code>, <code>_italic_</code>,{" "}
            <code># Heading</code>, <code>- list</code>,{" "}
            <code>[link](url)</code>.
          </p>
        </Section>

        <Section title="Categorisation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select
                name="category"
                value={state.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-navy-200 bg-white focus:outline-none focus:border-navy-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Author byline">
              <input
                type="text"
                name="authorName"
                value={state.authorName}
                onChange={(e) => set("authorName", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-navy-200 focus:outline-none focus:border-navy-900"
              />
            </Field>
          </div>
          <Field label="Tags" hint="Comma-separated. Used for related articles.">
            <input
              type="text"
              name="tags"
              value={state.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="CV, finance, applications"
              className="w-full h-11 px-4 rounded-lg border border-navy-200 focus:outline-none focus:border-navy-900"
            />
          </Field>
          <input type="hidden" name="readMinutes" value={state.readMinutes} />
        </Section>
      </div>

      <aside>
        <div className="bg-white border border-navy-100 rounded-2xl p-5 lg:sticky lg:top-6">
          <h3 className="text-xs uppercase tracking-widest text-navy-900 font-semibold mb-4">
            Publish
          </h3>
          <label className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              name="published"
              checked={state.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-4 w-4 rounded border-navy-300 text-navy-900"
            />
            <span className="text-sm text-navy-900">
              {state.published
                ? "Published — visible on /advice"
                : "Draft — admin only"}
            </span>
          </label>

          <label className="flex items-center gap-3 mb-5">
            <input
              type="checkbox"
              name="isFeatured"
              checked={state.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              disabled={!state.published}
              className="h-4 w-4 rounded border-navy-300 text-navy-900 disabled:opacity-50"
            />
            <span
              className={
                "text-sm " +
                (state.published ? "text-navy-900" : "text-navy-400")
              }
            >
              Feature on /advice
              {!state.published && (
                <span className="block text-xs text-navy-400 mt-0.5">
                  (publish first)
                </span>
              )}
            </span>
          </label>

          <Button type="submit" variant="primary" size="md" className="w-full">
            <Save className="h-4 w-4" />
            {isEdit ? "Save changes" : "Save draft"}
          </Button>

          {state.published && state.slug && (
            <a
              href={`/advice/${state.slug}`}
              target="_blank"
              rel="noopener"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-navy-200 text-sm font-medium hover:bg-navy-50"
            >
              <Eye className="h-4 w-4" /> View public page
            </a>
          )}

          {isEdit && initial?.id && deleteAction && (
            <button
              type="submit"
              formAction={deleteAction}
              onClick={(e) => {
                if (!confirm("Delete this article? This cannot be undone.")) {
                  e.preventDefault();
                }
              }}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete article
            </button>
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

