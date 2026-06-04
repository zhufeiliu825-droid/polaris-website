"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function readArticleForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const category = String(formData.get("category") ?? "Applications").trim();
  const tagsStr = String(formData.get("tags") ?? "");
  const tags = tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const authorName = String(formData.get("authorName") ?? "").trim() || null;
  const readMinutesStr = String(formData.get("readMinutes") ?? "5");
  const readMinutes = Math.max(1, Number(readMinutesStr) || 5);
  const published = formData.get("published") === "on";
  return { title, excerpt, body, category, tags, authorName, readMinutes, published };
}

export async function createArticle(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const data = readArticleForm(formData);
  if (!data.title || !slug) throw new Error("missing fields");
  const article = await prisma.article.create({
    data: {
      slug,
      ...data,
      publishedAt: data.published ? new Date() : null,
    },
  });
  revalidatePath("/admin/advice");
  revalidatePath("/advice");
  redirect(`/admin/advice/${article.id}`);
}

export async function updateArticle(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  if (!id || !slug) throw new Error("missing fields");
  const data = readArticleForm(formData);

  const existing = await prisma.article.findUnique({ where: { id } });
  const publishedAt =
    data.published && (!existing || !existing.publishedAt)
      ? new Date()
      : existing?.publishedAt ?? null;

  await prisma.article.update({
    where: { id },
    data: { slug, ...data, publishedAt: data.published ? publishedAt : null },
  });
  revalidatePath(`/admin/advice/${id}`);
  revalidatePath("/admin/advice");
  revalidatePath("/advice");
  revalidatePath(`/advice/${slug}`);
}

export async function deleteArticle(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("missing id");
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/advice");
  revalidatePath("/advice");
  redirect("/admin/advice");
}
