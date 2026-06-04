import fs from "node:fs"; import path from "node:path";
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}
async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const events = await prisma.event.findMany({ select: { slug: true, title: true, published: true, startsAt: true, endsAt: true } });
  const articles = await prisma.article.findMany({ select: { slug: true, title: true, published: true } });
  console.log("=== Events ==="); events.forEach(e => console.log(e.slug, "|", e.title, "|", e.published, "|", e.startsAt?.toISOString(), "->", e.endsAt?.toISOString()));
  console.log("=== Articles ==="); articles.forEach(a => console.log(a.slug, "|", a.title, "|", a.published));
}
main();
