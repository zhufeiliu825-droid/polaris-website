import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { ArticleForm } from "../article-form";
import { updateArticle, deleteArticle } from "../actions";
import { SavedBanner } from "../../saved-banner";

export const metadata = { title: "Admin · Edit article" };

type Params = Promise<{ id: string }>;
type Search = Promise<{ saved?: string }>;

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 max-w-6xl">
      <Link
        href="/admin/advice"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
      {saved && <SavedBanner />}
      <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-navy-950 mb-2">
            {article.title}
          </h1>
          <p className="text-navy-600">
            {article.published && article.publishedAt
              ? `Published ${article.publishedAt.toLocaleDateString("en-GB", { dateStyle: "long" })}`
              : `Draft since ${article.createdAt.toLocaleDateString("en-GB", { dateStyle: "long" })}`}
          </p>
        </div>
        <form action={deleteArticle}>
          <input type="hidden" name="id" value={article.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </form>
      </div>
      <ArticleForm
        action={updateArticle}
        initial={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
          category: article.category,
          tags: article.tags,
          readMinutes: article.readMinutes,
          authorName: article.authorName ?? "Polaris team",
          published: article.published,
          publishedAt: article.publishedAt?.toISOString() ?? null,
          isFeatured: article.isFeatured,
          createdAt: article.createdAt.toISOString(),
        }}
        isEdit
      />
    </div>
  );
}
