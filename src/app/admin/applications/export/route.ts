import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ApplicationStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "WON", "LOST", "ARCHIVED"];

/** RFC-4180 CSV field escaping. */
function csv(value: unknown): string {
  const s =
    value == null
      ? ""
      : value instanceof Date
        ? value.toISOString()
        : Array.isArray(value)
          ? value.join("; ")
          : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Streams the (optionally filtered) applications as a CSV download.
 * Lives under /admin so it's behind the auth proxy — only staff can call it.
 * Respects the same ?status= and ?q= filters as the list page.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") ?? "All";
  const q = (sp.get("q") ?? "").trim();

  const where: Prisma.ApplicationWhereInput = {};
  if (status !== "All" && STATUSES.includes(status)) {
    where.status = status as ApplicationStatus;
  }
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { university: { contains: q, mode: "insensitive" } },
      { course: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Submitted",
    "First name",
    "Last name",
    "Email",
    "Phone",
    "City",
    "From",
    "Education level",
    "University",
    "Course",
    "Graduation year",
    "Experience",
    "LinkedIn",
    "Career stage",
    "Target sectors",
    "Preferred locations",
    "Start timing",
    "Programme",
    "Source",
    "Status",
    "Assigned to",
    "Marketing opt-in",
    "Notes",
    "Internal notes",
  ];

  const lines = [
    headers.map(csv).join(","),
    ...rows.map((a) =>
      [
        a.createdAt,
        a.firstName,
        a.lastName,
        a.email,
        a.phone,
        a.city,
        a.nationality,
        a.degreeLevel,
        a.university,
        a.course,
        a.graduationYear,
        a.experienceLevel,
        a.linkedin,
        a.careerStage,
        a.targetSectors,
        a.preferredLocations,
        a.startTiming,
        a.programme,
        a.source,
        a.status,
        a.assignedTo,
        a.marketingOptIn ? "yes" : "no",
        a.notes,
        a.internalNotes,
      ]
        .map(csv)
        .join(",")
    ),
  ];

  // BOM so Excel reads UTF-8 (names with accents) correctly.
  const body = "﻿" + lines.join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="polaris-applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
