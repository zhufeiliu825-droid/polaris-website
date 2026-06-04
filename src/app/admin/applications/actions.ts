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

/**
 * One server action that updates every editable field on the application —
 * workflow (status/owner/notes) plus the original user-supplied data, so
 * staff can fix or fill in gaps after talking to the applicant.
 *
 * Empty strings normalise to null in the DB. Arrays come through formData
 * via `getAll()`. `privacyAccepted` is intentionally NOT here — that's a
 * legal record we don't let staff retroactively flip.
 */
export async function updateApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("missing id");

  const str = (k: string): string | null => {
    const v = String(formData.get(k) ?? "").trim();
    return v ? v : null;
  };
  const arr = (k: string): string[] =>
    formData.getAll(k).map((v) => String(v)).filter(Boolean);
  const bool = (k: string): boolean => formData.get(k) === "on";

  const status = String(formData.get("status") ?? "");
  if (!ALLOWED.includes(status as ApplicationStatus)) {
    throw new Error("invalid status");
  }

  // graduationYear may be empty, a year integer, or a verbal value like
  // "Still studying". Only the integer case writes to the schema's Int
  // column; otherwise we store it in the notes-adjacent field and clear
  // the Int.
  const gradYearRaw = String(formData.get("graduationYear") ?? "").trim();
  const gradYearInt = /^\d+$/.test(gradYearRaw)
    ? parseInt(gradYearRaw, 10)
    : null;

  await prisma.application.update({
    where: { id },
    data: {
      // Workflow
      status: status as ApplicationStatus,
      assignedTo: str("assignedTo"),
      internalNotes: str("internalNotes"),

      // Contact
      firstName: String(formData.get("firstName") ?? "").trim() || "(no name)",
      lastName: String(formData.get("lastName") ?? "").trim() || "",
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: str("city"),
      nationality: str("nationality"),

      // Education
      degreeLevel: str("degreeLevel"),
      university: str("university"),
      course: str("course"),
      graduationYear: gradYearInt,
      experienceLevel: str("experienceLevel"),
      linkedin: str("linkedin"),

      // Career direction
      careerStage: str("careerStage"),
      targetSectors: arr("targetSectors"),
      preferredLocations: arr("preferredLocations"),
      startTiming: str("startTiming"),
      programme: str("programme"),

      // Their words
      notes: str("notes"),

      // Final
      source: str("source"),
      marketingOptIn: bool("marketingOptIn"),
    },
  });
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath(`/admin/applications`);
  revalidatePath(`/admin`);
  // Redirect so the page hard-reloads with the saved values. Without this the
  // uncontrolled defaultValue inputs keep their pre-save state in React and it
  // looks like nothing happened.
  redirect(`/admin/applications/${id}?saved=1`);
}

export async function deleteApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("missing id");
  await prisma.application.delete({ where: { id } });
  revalidatePath(`/admin/applications`);
  revalidatePath(`/admin`);
  redirect("/admin/applications");
}
