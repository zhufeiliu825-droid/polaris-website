/**
 * Quick E2E for the Join server action — calls it directly (bypassing the form
 * UI) to confirm it writes to the DB.
 */
import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}

async function main() {
  const { submitJoin } = await import("../src/app/(public)/join/actions");
  const result = await submitJoin({
    firstName: "Test",
    lastName: "Applicant",
    email: `lzf825@hotmail.com`, // real address so we can verify the receipt
    phone: "+44 7700 900000",
    city: "London",
    nationality: "United Kingdom",
    careerStage: "Looking for my first graduate role",
    targetSectors: ["Finance", "Consulting"],
    startTiming: "Within 3 months",
    preferredLocations: ["London"],
    degreeLevel: "Undergraduate",
    university: "University of Warwick",
    course: "BSc Economics",
    yearOfStudy: "Final year",
    graduationYear: "2026",
    academicResult: "Predicted First / Distinction",
    spokenLanguages: ["English (native)", "Mandarin"],
    experienceLevel: "1+ internship",
    linkedin: "https://linkedin.com/in/test-applicant",
    targetEmployers: "Goldman Sachs, BCG",
    proudOf: "Founded a student investment society at uni.",
    notes: "Particularly interested in Asia-focused desks.",
    programme: "VIP (12 months)",
    source: "LinkedIn",
    privacyAccepted: true,
    marketingOptIn: true,
  });
  console.log("✓ created application:", result.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
