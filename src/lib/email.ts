/**
 * Transactional email helpers, using Resend.
 *
 * In production you almost certainly want RESEND_FROM set to
 * "Polaris Consulting <noreply@polarisconsulting.uk>" once the domain is
 * verified on Resend. The sandbox sender ("onboarding@resend.dev") only
 * delivers to the Resend account owner's own email.
 *
 * Contact details (footer address, phone, staff inbox) come from a single
 * source of truth — siteConfig — so they never drift from the website.
 */

import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM ?? "Polaris Consulting <onboarding@resend.dev>";
const STAFF_INBOX = process.env.STAFF_INBOX ?? siteConfig.contact.email;
const SITE = siteConfig.url;

const BRAND = "Polaris Consulting";
const ADDRESS = `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`;
const PHONE = siteConfig.contact.phone;

/** Brand palette, kept in sync with the tokens in globals.css. */
const C = {
  ink: "#0a1635",
  body: "#1d2d54",
  muted: "#3f5687",
  faint: "#94a4c5",
  sand: "#8e6440",
  line: "#e4e8f3",
  bg: "#f3f5fb",
} as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Wraps inner content in the shared email shell: a proper <head> (charset +
 * viewport + color-scheme so clients don't dark-mode-invert it), a hidden
 * preheader (the grey preview line inboxes show next to the subject), the
 * Polaris eyebrow, and a footer with the address pulled from siteConfig.
 */
function shell({ preheader, inner }: { preheader: string; inner: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${C.ink};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};opacity:0;">${escapeHtml(preheader)}</div>
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#fff;border:1px solid ${C.line};border-radius:16px;padding:36px;">
      <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.sand};font-weight:600;margin:0 0 16px 0;">${BRAND}</p>
      ${inner}
    </div>
    <p style="font-size:12px;color:${C.faint};text-align:center;line-height:1.6;margin:20px 0 0 0;">
      ${BRAND} · ${ADDRESS} · ${PHONE}
    </p>
  </div>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${C.ink};color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:500;font-size:14px;">${label}</a>`;
}

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

async function send(args: SendArgs) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to", args.to);
    return;
  }
  const result = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
  });
  if (result.error) {
    console.error("[email] Resend error:", result.error);
    throw new Error(`Email send failed: ${result.error.message}`);
  }
  return result.data;
}

type BuiltEmail = { subject: string; html: string; text: string };

/**
 * Builds the applicant confirmation receipt (no network). Exported so the
 * template can be rendered/previewed without sending.
 */
export function buildApplicantReceipt(args: {
  firstName: string;
  email: string;
}): BuiltEmail {
  const name = args.firstName.trim();
  const hi = name ? ` ${escapeHtml(name)}` : "";

  const inner = `
      <h1 style="font-size:24px;font-weight:500;line-height:1.3;color:${C.ink};margin:0 0 18px 0;">Thanks${hi} — we&rsquo;ve received your application.</h1>
      <p style="font-size:16px;line-height:1.6;color:${C.body};margin:0 0 18px 0;">
        A member of the Polaris team will review your details and be in touch within
        <strong>five working days</strong>. We typically book a 30-minute introductory call to talk
        through your goals and recommend a programme.
      </p>
      <p style="font-size:16px;line-height:1.6;color:${C.body};margin:0 0 4px 0;">
        In the meantime, explore our latest
        <a href="${SITE}/opportunities" style="color:${C.sand};">opportunities</a> and
        <a href="${SITE}/advice" style="color:${C.sand};">career advice</a>.
      </p>
      <p style="margin:24px 0;">${button(`${SITE}/opportunities`, "Browse opportunities →")}</p>
      <p style="font-size:14px;line-height:1.6;color:${C.muted};border-top:1px solid ${C.line};padding-top:24px;margin:32px 0 0 0;">
        Questions? Just reply to this email — it goes straight to the Polaris team.
      </p>`;

  const text = `Thanks${name ? ` ${name}` : ""} — we've received your application.

A member of the Polaris team will review your details and be in touch within five working days. We typically book a 30-minute introductory call to talk through your goals and recommend a programme.

In the meantime, explore our latest opportunities (${SITE}/opportunities) and career advice (${SITE}/advice).

Questions? Just reply to this email — it goes straight to the Polaris team.

${BRAND}
${ADDRESS} · ${PHONE}`;

  return {
    subject: "Thanks for getting in touch with Polaris",
    html: shell({
      preheader:
        "We've received your application — a Polaris mentor will be in touch within five working days.",
      inner,
    }),
    text,
  };
}

/**
 * Sends the applicant confirmation receipt. Replies route to the staff inbox.
 */
export async function sendApplicantReceipt(args: {
  firstName: string;
  email: string;
}) {
  const { subject, html, text } = buildApplicantReceipt(args);
  return send({ to: args.email, subject, html, text, replyTo: STAFF_INBOX });
}

type StaffAlertArgs = {
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  university: string | null;
  course: string | null;
  targetSectors: string[];
  programme: string | null;
  source: string | null;
};

/**
 * Builds the staff "new application" alert (no network). Exported for preview.
 */
export function buildStaffApplicationAlert(args: StaffAlertArgs): BuiltEmail {
  const fullName = `${args.firstName} ${args.lastName}`.trim();
  const adminUrl = `${SITE}/admin/applications/${args.applicationId}`;

  // label → already-safe HTML value. Optional fields are simply omitted.
  const rows: Array<[string, string]> = [
    ["Email", `<a href="mailto:${escapeHtml(args.email)}" style="color:${C.ink};">${escapeHtml(args.email)}</a>`],
    ["Phone", escapeHtml(args.phone)],
  ];
  if (args.university) rows.push(["University", escapeHtml(args.university)]);
  if (args.course) rows.push(["Course", escapeHtml(args.course)]);
  if (args.targetSectors.length) rows.push(["Sectors", escapeHtml(args.targetSectors.join(", "))]);
  if (args.programme) rows.push(["Programme", escapeHtml(args.programme)]);
  if (args.source) rows.push(["Source", escapeHtml(args.source)]);

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;font-size:13px;color:${C.faint};width:120px;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:14px;">${value}</td></tr>`,
    )
    .join("\n        ");

  const inner = `
      <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.faint};font-weight:600;margin:0 0 6px 0;">New application</p>
      <h1 style="font-size:22px;font-weight:500;color:${C.ink};margin:0 0 20px 0;">${escapeHtml(fullName)}</h1>
      <table style="width:100%;border-collapse:collapse;">
        ${tableRows}
      </table>
      <p style="margin:28px 0 0 0;">${button(adminUrl, "Open in admin →")}</p>
      <p style="font-size:12px;line-height:1.6;color:${C.faint};border-top:1px solid ${C.line};padding-top:16px;margin:24px 0 0 0;">
        Reply to this email to respond to ${escapeHtml(args.firstName)} directly.
      </p>`;

  const text = `New Polaris application

${fullName}
Email:      ${args.email}
Phone:      ${args.phone}
University: ${args.university ?? "—"}
Course:     ${args.course ?? "—"}
Sectors:    ${args.targetSectors.join(", ") || "—"}
Programme:  ${args.programme ?? "—"}
Source:     ${args.source ?? "—"}

Open in admin: ${adminUrl}
(Reply to this email to respond to ${args.firstName} directly.)`;

  return {
    subject: `New application: ${fullName}`,
    html: shell({
      preheader: `${fullName}${args.university ? ` · ${args.university}` : ""}${args.targetSectors.length ? ` · ${args.targetSectors.join(", ")}` : ""}`,
      inner,
    }),
    text,
  };
}

/**
 * Sends the staff alert to the staff inbox. Replies route to the applicant.
 */
export async function sendStaffApplicationAlert(args: StaffAlertArgs) {
  const { subject, html, text } = buildStaffApplicationAlert(args);
  return send({ to: STAFF_INBOX, subject, html, text, replyTo: args.email });
}
