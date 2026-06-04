import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "../article-form";
import { createArticle } from "../actions";

export const metadata = { title: "Admin · New article" };

export default function NewArticlePage() {
  return (
    <div className="px-8 py-10 max-w-6xl">
      <Link
        href="/admin/advice"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
      <h1 className="text-3xl font-light tracking-tight text-navy-950 mb-8">
        Write a new article
      </h1>
      <ArticleForm action={createArticle} />
    </div>
  );
}
