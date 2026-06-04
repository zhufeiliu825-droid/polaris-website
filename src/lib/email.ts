/**
 * Transactional email helpers, using Resend.
 *
 * In production you almost certainly want RESEND_FROM set to
 * "Polaris Consulting <noreply@polarisconsulting.uk>" once the domain is
 * verified on Resend. The sandbox sender ("onboarding@resend.dev") only
 * delivers to the Resend account owner's own email.
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM ?? "Polaris Consulting <onboarding@resend.dev>";
const STAFF_INBOX = process.env.STAFF_INBOX ?? "contact@polarisconsulting.uk";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

/**
 * Sends to the applicant — confirmation receipt.
 */
export async function sendApplicantReceipt(args: {
  firstName: string;
  email: string;
}) {
  const greeting = args.firstName ? `Hi ${args.firstName}` : "Hi";
  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f5fb;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0a1635;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#fff;border:1px solid #e4e8f3;border-radius:16px;padding:36px;">
      <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8e6440;font-weight:600;margin:0 0 12px 0;">POLARIS CONSULTING</p>
      <h1 style="font-size:24px;font-weight:500;margin:0 0 18px 0;line-height:1.3;">Thanks ${escapeHtml(greeting.replace(/^Hi /, ""))} — we&apos;ve received your application.</h1>
      <p style="font-size:16px;line-height:1.6;color:#1d2d54;margin:0 0 18px 0;">
        A member of the Polaris team will review your details and be in touch within
        <strong>five working days</strong>. We typically book a 30-minute introductory call to talk
        through your goals and recommend a programme.
      </p>
      <p style="font-size:16px;line-height:1.6;color:#1d2d54;margin:0 0 18px 0;">
        In the meantime, feel free to browse our latest opportunities and articles:
      </p>
      <p style="margin:24px 0;">
        <a href="https://polarisconsulting.uk/opportunities" style="display:inline-block;background:#0a1635;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:500;font-size:14px;">Browse opportunities →</a>
      </p>
      <p style="font-size:14px;line-height:1.6;color:#3f5687;margin:32px 0 0 0;border-top:1px solid #e4e8f3;padding-top:24px;">
        Questions? Just reply to this email — it goes straight to the Polaris team.
      </p>
      <p style="font-size:12px;color:#94a4c5;margin:24px 0 0 0;">
        Polaris Consulting · 180 Strand, London WC2R 1EA · 07493 130 899
      </p>
    </div>
  </div>
</body></html>`;
  const text = `Thanks ${args.firstName} — we've received your application.

A member of the Polaris team will review your details and be in touch within five working days. We typically book a 30-minute introductory call to talk through your goals and recommend a programme.

In the meantime, feel free to browse our latest opportunities and articles at https://polarisconsulting.uk/opportunities.

Questions? Just reply to this email.

Polaris Consulting
180 Strand, London WC2R 1EA · 07493 130 899`;

  return send({
    to: args.email,
    subject: "Thanks for joining Polaris",
    html,
    text,
    replyTo: STAFF_INBOX,
  });
}

/**
 * Sends to the staff inbox — alert about a new application.
 */
export async function sendStaffApplicationAlert(args: {
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
}) {
  const fullName = `${args.firstName} ${args.lastName}`;
  const adminUrl = `https://polarisconsulting.uk/admin/applications/${args.applicationId}`;
  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f5fb;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0a1635;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#fff;border:1px solid #e4e8f3;border-radius:16px;padding:36px;">
      <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8e6440;font-weight:600;margin:0 0 12px 0;">NEW APPLICATION</p>
      <h1 style="font-size:22px;font-weight:500;margin:0 0 20px 0;">${escapeHtml(fullName)}</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;width:120px;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${escapeHtml(args.email)}" style="color:#0a1635;">${escapeHtml(args.email)}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;">Phone</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(args.phone)}</td></tr>
        ${args.university ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;">University</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(args.university)}</td></tr>` : ""}
        ${args.course ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;">Course</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(args.course)}</td></tr>` : ""}
        ${args.targetSectors.length ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;">Sectors</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(args.targetSectors.join(", "))}</td></tr>` : ""}
        ${args.programme ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;">Programme</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(args.programme)}</td></tr>` : ""}
        ${args.source ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a4c5;">Source</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(args.source)}</td></tr>` : ""}
      </table>
      <p style="margin:28px 0 0 0;">
        <a href="${adminUrl}" style="display:inline-block;background:#0a1635;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:500;font-size:14px;">Open in admin →</a>
      </p>
    </div>
  </div>
</body></html>`;
  const text = `New Polaris application

${fullName}
Email:  ${args.email}
Phone:  ${args.phone}
University: ${args.university ?? "—"}
Course: ${args.course ?? "—"}
Sectors: ${args.targetSectors.join(", ") || "—"}
Programme: ${args.programme ?? "—"}
Source: ${args.source ?? "—"}

Open in admin: ${adminUrl}`;

  return send({
    to: STAFF_INBOX,
    subject: `New application: ${fullName}`,
    html,
    text,
    replyTo: args.email,
  });
}
