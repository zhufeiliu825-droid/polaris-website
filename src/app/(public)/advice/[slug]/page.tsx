import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Markdown } from "@/components/markdown";
import { getArticleBySlug, getPublishedArticles } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a || !a.published) return { title: "Article not found" };
  return { title: a.title, description: a.excerpt };
}

export default async function AdviceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const publishedDate = article.publishedAt
    ? article.publishedAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Related: same category, exclude self (derived from the cached set).
  const related = (await getPublishedArticles())
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <article className="bg-paper">
      <header className="bg-white border-b border-navy-100 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Link
              href="/advice"
              className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> All advice
            </Link>
            <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
              {article.category}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-light tracking-tight text-navy-950 leading-tight">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-navy-600 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="mt-7 flex items-center gap-x-5 gap-y-2 text-sm text-navy-500 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {article.readMinutes} min read
              </span>
              {publishedDate && <span>{publishedDate}</span>}
              {article.authorName && <span>By {article.authorName}</span>}
            </div>
          </div>
        </Container>
      </header>

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            <div className="max-w-3xl">
              <Markdown markdown={article.body} headingOffset={1} className="text-navy-800 text-base md:text-lg leading-relaxed" />

              {article.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-navy-100 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-navy-400" />
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex h-7 px-3 items-center rounded-full bg-navy-50 text-navy-700 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-6 self-start">
              {related.length > 0 && (
                <div className="bg-white border border-navy-100 rounded-2xl p-6">
                  <h3 className="text-xs uppercase tracking-widest text-navy-900 font-semibold mb-4">
                    More in {article.category}
                  </h3>
                  <ul className="space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/advice/${r.slug}`}
                          className="group block"
                        >
                          <p className="text-sm font-medium text-navy-950 group-hover:text-navy-700 leading-snug">
                            {r.title}
                          </p>
                          <p className="mt-1 text-xs text-navy-500 inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {r.readMinutes} min
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </Container>
      </section>
    </article>
  );
}
