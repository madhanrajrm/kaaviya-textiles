import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const isVercel = process.env.VERCEL === "1";

if (isVercel) {
  const sourceDb = path.join(process.cwd(), "prisma", "dev.db");
  const runtimeDb = "/tmp/dev.db";

  if (!fs.existsSync(runtimeDb)) {
    fs.copyFileSync(sourceDb, runtimeDb);
  }

  process.env.DATABASE_URL = "file:/tmp/dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
