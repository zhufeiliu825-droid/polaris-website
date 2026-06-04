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

export function Markdown({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
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
        out.push(
          <a
            key={out.length}
            href={first.m[2]}
            target={first.m[2].startsWith("http") ? "_blank" : undefined}
            rel={first.m[2].startsWith("http") ? "noopener" : undefined}
            className="text-navy-900 underline underline-offset-2 hover:text-navy-700"
          >
            {first.m[1]}
          </a>
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

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1
          key={elements.length}
          className="text-3xl md:text-4xl font-light tracking-tight text-navy-950 mt-8 mb-4 first:mt-0"
        >
          {inline(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={elements.length}
          className="text-2xl font-medium tracking-tight text-navy-950 mt-10 mb-4"
        >
          {inline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={elements.length}
          className="text-xl font-medium text-navy-950 mt-7 mb-3"
        >
          {inline(line.slice(4))}
        </h3>
      );
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
