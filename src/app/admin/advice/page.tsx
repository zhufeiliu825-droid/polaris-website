import Link from "next/link";
import { Plus, Clock, ArrowRight, Tag } from "lucide-react";
import { prisma } from "@/lib/db";
import { PublishedPill } from "../events/page";

export const metadata = { title: "Admin · Advice" };

export default async function AdminAdvicePage() {
  const articles = await prisma.article.findMany({
    orderBy: [{ published: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="px-8 py-10">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            Advice
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-navy-950">
            Career-advice articles
          </h1>
        </div>
        <Link
          href="/admin/advice/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-navy-950 text-white text-sm font-medium hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" /> Write article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
          <p className="text-navy-600">
            No articles yet —{" "}
            <Link href="/admin/advice/new" className="underline">
              write your first one
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/advice/${a.id}`}
                className="block bg-white border border-navy-100 rounded-2xl p-6 hover:border-navy-900 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <PublishedPill published={a.published} />
                      <span className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
                        {a.category}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-medium text-navy-950 tracking-tight">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm text-navy-600 line-clamp-2">
                      {a.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-x-5 gap-y-2 text-xs text-navy-500 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {a.readMinutes} min read
                      </span>
                      <span>
                        {a.published && a.publishedAt
                          ? "Published " +
                            a.publishedAt.toLocaleDateString("en-GB", { dateStyle: "medium" })
                          : "Drafted " +
                            a.createdAt.toLocaleDateString("en-GB", { dateStyle: "medium" })}
                      </span>
                      {a.tags.length > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" />
                          {a.tags.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-navy-400 mt-1 shrink-0" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
