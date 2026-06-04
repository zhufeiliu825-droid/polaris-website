import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { ArticleForm } from "../article-form";
import { updateArticle, deleteArticle } from "../actions";

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
    <div className="px-8 py-10 max-w-6xl">
      <Link
        href="/admin/advice"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
      {saved && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          Changes saved.
        </div>
      )}
      <h1 className="text-3xl font-light tracking-tight text-navy-950 mb-2">
        {article.title}
      </h1>
      <p className="text-navy-600 mb-8">
        {article.published && article.publishedAt
          ? `Published ${article.publishedAt.toLocaleDateString("en-GB", { dateStyle: "long" })}`
          : `Draft since ${article.createdAt.toLocaleDateString("en-GB", { dateStyle: "long" })}`}
      </p>
      <ArticleForm
        action={updateArticle}
        deleteAction={deleteArticle}
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
