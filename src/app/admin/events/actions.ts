"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { EventFormat } from "@prisma/client";

function parseFormat(s: string): EventFormat {
  if (s === "ONLINE" || s === "IN_PERSON" || s === "HYBRID") return s;
  return "ONLINE";
}

export async function createEvent(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const data = readEventForm(formData);
  if (!data.title || !slug) throw new Error("missing fields");
  const event = await prisma.event.create({
    data: { slug, ...data, publishedAt: data.published ? new Date() : null },
  });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  if (!id || !slug) throw new Error("missing fields");
  const data = readEventForm(formData);

  const existing = await prisma.event.findUnique({ where: { id } });
  const publishedAt =
    data.published && (!existing || !existing.publishedAt)
      ? new Date()
      : existing?.publishedAt ?? null;

  await prisma.event.update({
    where: { id },
    data: { slug, ...data, publishedAt: data.published ? publishedAt : null },
  });
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  // Hard-reload the edit page so the green "Changes saved" banner shows
  // and React's uncontrolled inputs pick up the saved values (same trick
  // we use for /admin/applications).
  redirect(`/admin/events/${id}?saved=1`);
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("missing id");
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

function readEventForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const startsAtStr = String(formData.get("startsAt") ?? "");
  const endsAtStr = String(formData.get("endsAt") ?? "");
  const format = parseFormat(String(formData.get("format") ?? ""));
  const location = String(formData.get("location") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim() || null;
  const capacityStr = String(formData.get("capacity") ?? "").trim();
  const capacity = capacityStr ? Number(capacityStr) : null;
  const registrationUrl =
    String(formData.get("registrationUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  return {
    title,
    excerpt,
    body,
    startsAt: new Date(startsAtStr),
    endsAt: new Date(endsAtStr),
    format,
    location,
    sector,
    capacity,
    registrationUrl,
    published,
  };
}
