import fs from "node:fs"; import path from "node:path";
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}
async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  // Mark the 2 published seed articles as featured (so we see the 2-card row)
  const r = await prisma.article.updateMany({
    where: { published: true },
    data: { isFeatured: true },
  });
  console.log("marked featured:", r.count);
}
main();
