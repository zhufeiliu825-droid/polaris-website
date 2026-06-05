/**
 * Minimal Markdown renderer — handles headings, bold/italic, lists, links and
 * paragraphs. Used by both the admin editor preview and the public article
 * detail page so a draft renders identically to a published page.
 *
 * Intentionally small: we don't need code blocks, tables, images, or any of
 * the heavier flavours of Markdown for editorial articles. If we ever do,
 * swap this for `marked` / `markdown-it`.
 */
import React from "react";

/** Only allow safe link schemes. Blocks javascript:/data: etc. (stored XSS). */
function safeHref(href: string): string | null {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(href.trim()) ? href : null;
}

export function Markdown({
  markdown,
  className,
  headingOffset = 0,
}: {
  markdown: string;
  className?: string;
  /** Demote body headings (e.g. pass 1 on detail pages where the title is the
   *  page h1, so a body "# " renders as h2 instead of a second h1). */
  headingOffset?: number;
}) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`l${elements.length}`}
          className="list-disc pl-5 my-4 space-y-1.5 text-navy-800"
        >
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  function inline(s: string): React.ReactNode {
    const out: React.ReactNode[] = [];
    let rest = s;
    while (rest.length > 0) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(rest);
      const boldMatch = /\*\*([^*]+)\*\*/.exec(rest);
      const italicMatch = /_([^_]+)_/.exec(rest);
      const candidates = [linkMatch, boldMatch, italicMatch]
        .map((m, i) => (m ? { m, i, idx: m.index } : null))
        .filter((x): x is { m: RegExpExecArray; i: number; idx: number } => !!x)
        .sort((a, b) => a.idx - b.idx);
      if (candidates.length === 0) {
        out.push(rest);
        break;
      }
      const first = candidates[0];
      if (first.idx > 0) out.push(rest.slice(0, first.idx));
      if (first.i === 0) {
        const href = safeHref(first.m[2]);
        const external = !!href && /^https?:/i.test(href);
        out.push(
          href ? (
            <a
              key={out.length}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-navy-900 underline underline-offset-2 hover:text-navy-700"
            >
              {first.m[1]}
            </a>
          ) : (
            // Unsafe scheme — render the link text as plain text, no href.
            <span key={out.length}>{first.m[1]}</span>
          )
        );
      } else if (first.i === 1) {
        out.push(
          <strong key={out.length} className="font-semibold text-navy-950">
            {first.m[1]}
          </strong>
        );
      } else {
        out.push(<em key={out.length}>{first.m[1]}</em>);
      }
      rest = rest.slice(first.idx + first.m[0].length);
    }
    return out;
  }

  const headingClass: Record<number, string> = {
    1: "text-3xl md:text-4xl font-light tracking-tight text-navy-950 mt-8 mb-4 first:mt-0",
    2: "text-2xl font-medium tracking-tight text-navy-950 mt-10 mb-4",
    3: "text-xl font-medium text-navy-950 mt-7 mb-3",
    4: "text-lg font-medium text-navy-950 mt-6 mb-2",
  };
  const heading = (level: number, text: string, key: number) => {
    const lvl = Math.min(6, level + headingOffset);
    const Tag = `h${lvl}` as keyof React.JSX.IntrinsicElements;
    return (
      <Tag key={key} className={headingClass[Math.min(4, lvl)] ?? headingClass[4]}>
        {inline(text)}
      </Tag>
    );
  };

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushList();
      elements.push(heading(1, line.slice(2), elements.length));
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(heading(2, line.slice(3), elements.length));
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(heading(3, line.slice(4), elements.length));
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(
        <li key={`li${listItems.length}`} className="leading-relaxed">
          {inline(line.slice(2))}
        </li>
      );
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={elements.length}
          className="my-4 leading-relaxed text-navy-800"
        >
          {inline(line)}
        </p>
      );
    }
  }
  flushList();

  return <div className={className}>{elements}</div>;
}
