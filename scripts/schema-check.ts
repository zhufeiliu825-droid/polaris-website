import fs from "node:fs"; import path from "node:path";
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}
async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const cols = await prisma.$queryRawUnsafe<any[]>(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='Job' ORDER BY ordinal_position`
  );
  cols.forEach(c => console.log(c.column_name.padEnd(22), c.data_type));
}
main();
