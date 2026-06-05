/**
 * Dev-only: render the transactional email templates to /tmp HTML files so we
 * can eyeball them without sending. Not part of the app. `npx tsx scripts/render-emails.ts`
 */
import fs from "node:fs";
import { buildApplicantReceipt, buildStaffApplicationAlert } from "../src/lib/email";

const applicant = buildApplicantReceipt({ firstName: "Jordan", email: "jordan@example.com" });
const applicantNoName = buildApplicantReceipt({ firstName: "", email: "x@example.com" });
const staff = buildStaffApplicationAlert({
  applicationId: "demo123",
  firstName: "Jordan",
  lastName: "Okafor",
  email: "jordan.okafor@example.com",
  phone: "+44 7700 900123",
  university: "University of Manchester",
  course: "BSc Economics",
  targetSectors: ["Finance", "Consulting"],
  programme: "Spring Mentoring Cohort",
  source: "Instagram",
});

fs.writeFileSync("/tmp/email-applicant.html", applicant.html);
fs.writeFileSync("/tmp/email-staff.html", staff.html);
console.log("APPLICANT subject :", applicant.subject);
console.log("NO-NAME headline  :", applicantNoName.html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]);
console.log("STAFF subject     :", staff.subject);
console.log("wrote /tmp/email-applicant.html, /tmp/email-staff.html");
