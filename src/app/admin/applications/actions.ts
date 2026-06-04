"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { ApplicationStatus } from "@prisma/client";

const ALLOWED: ApplicationStatus[] = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "WON",
  "LOST",
  "ARCHIVED",
];

export async function updateApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const assignedTo = String(formData.get("assignedTo") ?? "").trim();
  const internalNotes = String(formData.get("internalNotes") ?? "");
  if (!id) throw new Error("missing id");
  if (!ALLOWED.includes(status as ApplicationStatus)) {
    throw new Error("invalid status");
  }
  await prisma.application.update({
    where: { id },
    data: {
      status: status as ApplicationStatus,
      assignedTo: assignedTo || null,
      internalNotes: internalNotes || null,
    },
  });
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath(`/admin/applications`);
  revalidatePath(`/admin`);
}

export async function deleteApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("missing id");
  await prisma.application.delete({ where: { id } });
  revalidatePath(`/admin/applications`);
  revalidatePath(`/admin`);
  redirect("/admin/applications");
}
