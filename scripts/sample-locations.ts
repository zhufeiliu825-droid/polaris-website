import fs from "node:fs"; import path from "node:path";
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}
async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const sample = await prisma.job.findMany({
    where: { isActive: true },
    select: { jobTitle: true, locationName: true, employerName: true, sectors: true },
    take: 15, orderBy: { postedAt: "desc" },
  });
  for (const j of sample) console.log(`${(j.locationName ?? "—").padEnd(35)} | ${j.jobTitle.slice(0, 50).padEnd(50)} | ${j.employerName?.slice(0,25)}`);
  const counts = await prisma.$queryRawUnsafe<any[]>(`SELECT "locationName", COUNT(*)::int as n FROM "Job" WHERE "isActive"=true GROUP BY "locationName" ORDER BY n DESC LIMIT 12`);
  console.log("\n--- Top 12 locations ---");
  counts.forEach(c => console.log(`${String(c.n).padStart(3)}  ${c.locationName}`));
}
main();
