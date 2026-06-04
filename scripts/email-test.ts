/**
 * Tests Resend connectivity.
 *
 * Default behaviour: lists registered domains (just verifies the API key
 * works, sends nothing).
 *
 * With argv[2]: sends a single test receipt to that email.
 *   npx tsx scripts/email-test.ts lzf825@hotmail.com
 */
import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}

async function main() {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY!);

  console.log("From:", process.env.RESEND_FROM);
  console.log("Staff inbox:", process.env.STAFF_INBOX);
  console.log();

  // List domains — best-effort; restricted "send-only" keys can't call this.
  try {
    const domains = await resend.domains.list();
    if (domains.error) {
      console.log("Domains list: not available with this key (send-only)");
    } else {
      const list = (domains.data as any)?.data ?? domains.data ?? [];
      console.log("Domains on this Resend account:");
      if (!list || list.length === 0) {
        console.log("  (none yet)");
      } else {
        for (const d of list) console.log(`  - ${d.name}  [${d.status}]`);
      }
    }
  } catch (e) {
    console.log("Domains list: skipped (", e instanceof Error ? e.message : e, ")");
  }
  console.log();

  const recipient = process.argv[2];
  if (!recipient) {
    console.log("Usage: npx tsx scripts/email-test.ts <recipient-email>");
    console.log("       (skipping send — pass an email address to send a test)");
    return;
  }

  console.log(`Sending test receipt to ${recipient}…`);
  const { sendApplicantReceipt } = await import("../src/lib/email");
  const r = await sendApplicantReceipt({
    firstName: "Polaris",
    email: recipient,
  });
  console.log("✓ Sent. Resend id:", (r as any)?.id ?? r);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
