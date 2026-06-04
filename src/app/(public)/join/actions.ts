"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { sendApplicantReceipt, sendStaffApplicationAlert } from "@/lib/email";

/**
 * Submits a Join application. The Client form passes the FormState as JSON
 * via a `data` field — easier than serialising chip groups field-by-field.
 *
 * Returns nothing on success; client switches to its own "submitted" view.
 * Throws on validation failure — the form catches and shows a banner.
 */
export async function submitJoin(payload: JoinPayload): Promise<{ id: string }> {
  // Server-side validation, in case the client was bypassed.
  if (!payload.firstName?.trim() || !payload.lastName?.trim()) {
    throw new Error("Name is required");
  }
  if (!payload.email?.trim() || !/\S+@\S+\.\S+/.test(payload.email)) {
    throw new Error("A valid email is required");
  }
  if (!payload.phone?.trim()) {
    throw new Error("Phone is required");
  }
  if (!payload.privacyAccepted) {
    throw new Error("Please accept the privacy policy");
  }

  // "Graduation year" is a free-text dropdown — most values are numeric
  // years, but "Still studying" is also valid. We try to coerce to Int
  // and fall back to null so the form's string makes it intact into the
  // separate `notes` row for non-numeric responses.
  const gradYearParsed = payload.graduationYear
    ? parseInt(payload.graduationYear, 10)
    : NaN;
  const gradYearInt = Number.isFinite(gradYearParsed) ? gradYearParsed : null;
  const gradYearNote =
    payload.graduationYear && gradYearInt == null
      ? `Graduation: ${payload.graduationYear}`
      : null;

  const app = await prisma.application.create({
    data: {
      // Contact
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      nationality: payload.nationality || null,
      city: payload.city || null,

      // Education
      degreeLevel: payload.degreeLevel || null,
      university: payload.university || null,
      course: payload.course || null,
      graduationYear: gradYearInt,
      experienceLevel: payload.experienceLevel || null,
      linkedin: payload.linkedin || null,

      // Goals
      careerStage: payload.careerStage || null,
      targetSectors: payload.targetSectors ?? [],
      startTiming: payload.startTiming || null,
      preferredLocations: payload.preferredLocations ?? [],
      programme: payload.programme || null,

      // Their words — concatenate the open-text fields into notes so the
      // admin sees them as a single block.
      notes:
        [
          gradYearNote,
          payload.targetEmployers && `Inspired by: ${payload.targetEmployers}`,
          payload.proudOf && `Proud of: ${payload.proudOf}`,
          payload.notes,
        ]
          .filter(Boolean)
          .join("\n\n") || null,

      // Final
      source: payload.source || null,
      privacyAccepted: payload.privacyAccepted,
      marketingOptIn: !!payload.marketingOptIn,
      status: "NEW",
    },
  });

  // Fire-and-forget emails — we don't fail the user-visible submission if
  // Resend hiccups, since the application is already safely in the DB.
  // Errors are logged for the staff to investigate.
  try {
    await Promise.all([
      sendApplicantReceipt({ firstName: app.firstName, email: app.email }),
      sendStaffApplicationAlert({
        applicationId: app.id,
        firstName: app.firstName,
        lastName: app.lastName,
        email: app.email,
        phone: app.phone,
        university: app.university,
        course: app.course,
        targetSectors: app.targetSectors,
        programme: app.programme,
        source: app.source,
      }),
    ]);
  } catch (e) {
    console.error("[join] email dispatch failed for app", app.id, e);
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return { id: app.id };
}

export type JoinPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  nationality?: string;

  careerStage?: string;
  targetSectors?: string[];
  startTiming?: string;
  preferredLocations?: string[];

  degreeLevel?: string;
  university?: string;
  course?: string;
  graduationYear?: string;
  experienceLevel?: string;
  linkedin?: string;

  targetEmployers?: string;
  proudOf?: string;
  notes?: string;

  programme?: string;
  source?: string;
  privacyAccepted?: boolean;
  marketingOptIn?: boolean;
};
