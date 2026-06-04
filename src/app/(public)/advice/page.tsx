import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/db";

export const metadata = { title: "Career advice" };

const CATEGORIES = [
  "All",
  "Applications",
  "Interviews",
  "Assessment",
  "Industry insights",
  "Working life",
];

type Search = Promise<{ category?: string }>;

function formatPublishedDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdvicePage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const activeCategory = sp.category && sp.category !== "All" ? sp.category : null;

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(activeCategory ? { category: activeCategory } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  const [featured, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="Career advice"
        title="Practical guidance from people who hire graduates."
        subtitle="From writing your CV to surviving an assessment centre — straight talk, no fluff."
      />

      <section className="py-16 bg-paper">
        <Container>
          <div className="flex gap-2 flex-wrap mb-10 border-b border-navy-100 pb-6">
            {CATEGORIES.map((c) => {
              const isActive =
                c === "All" ? activeCategory == null : c === activeCategory;
              const href = c === "All" ? "/advice" : `/advice?category=${encodeURIComponent(c)}`;
              return (
                <Link
                  key={c}
                  href={href}
                  scroll={false}
                  className={
                    isActive
                      ? "h-9 px-4 inline-flex items-center rounded-full bg-navy-950 text-white text-sm font-medium"
                      : "h-9 px-4 inline-flex items-center rounded-full text-sm font-medium text-navy-700 hover:bg-navy-50"
                  }
                >
                  {c}
                </Link>
              );
            })}
          </div>

          {articles.length === 0 ? (
            <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
              <p className="text-navy-600">
                Nothing here yet — new articles drop most weeks.{" "}
                <Link href="/join" className="underline">
                  Join Polaris
                </Link>{" "}
                and we&apos;ll email when the next one is out.
              </p>
            </div>
          ) : (
            <>
              {/* FEATURED (only when viewing All) */}
              {!activeCategory && featured && (
                <Link
                  href={`/advice/${featured.slug}`}
                  className="group block bg-navy-950 rounded-3xl p-10 md:p-16 mb-12 relative overflow-hidden text-white hover:bg-navy-900 transition-colors"
                >
                  <div
                    className="absolute inset-0 opacity-10 bg-[url('/brand/pattern-dark.png')] bg-cover bg-center"
                    aria-hidden="true"
                  />
                  <div className="relative max-w-2xl">
                    <p className="text-xs uppercase tracking-widest text-sand-300 font-semibold">
                      Featured · {featured.category}
                    </p>
                    <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight leading-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-5 text-lg text-navy-100">{featured.excerpt}</p>
                    <div className="mt-7 flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-navy-200">
                        <Clock className="h-4 w-4" /> {featured.readMinutes} min read
                      </span>
                      <span className="text-navy-300">·</span>
                      <span className="text-navy-200">
                        {formatPublishedDate(featured.publishedAt)}
                      </span>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sand-200 group-hover:gap-3 transition-all">
                      Read article <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )}

              {/* GRID — when filtered, show ALL filtered articles in grid */}
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeCategory ? articles : rest).map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/advice/${a.slug}`}
                      className="group flex flex-col h-full bg-white border border-navy-100 rounded-2xl p-7 hover:border-navy-900 hover:shadow-lg transition-all"
                    >
                      <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                        {a.category}
                      </p>
                      <h3 className="mt-3 text-xl font-medium text-navy-950 tracking-tight group-hover:text-navy-700 leading-snug">
                        {a.title}
                      </h3>
                      <p className="mt-3 text-sm text-navy-600 leading-relaxed flex-1">
                        {a.excerpt}
                      </p>
                      <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {a.readMinutes} min
                        </span>
                        <span>{formatPublishedDate(a.publishedAt)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
