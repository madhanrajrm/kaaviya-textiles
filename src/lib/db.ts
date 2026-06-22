import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rawDatabaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
let databaseUrl = rawDatabaseUrl;

if (!databaseUrl.startsWith("file:")) {
  if (databaseUrl.startsWith("./")) {
    databaseUrl = `file:${databaseUrl}`;
  } else if (databaseUrl.endsWith(".db")) {
    databaseUrl = `file:./${databaseUrl}`;
  }
}

const isVercel = process.env.VERCEL === "1";
if (isVercel && databaseUrl.startsWith("file:")) {
  const filePath = databaseUrl.replace("file:./", "").replace("file:", "");
  const runtimePath = path.join("/tmp", path.basename(filePath));
  process.env.DATABASE_URL = `file:${runtimePath}`;
  databaseUrl = process.env.DATABASE_URL;

  if (!fs.existsSync(runtimePath)) {
    fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
    try {
     execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
    } catch (error) {
      console.error("Prisma migrate deploy failed on Vercel runtime:", error);
    }
  }
} else {
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
