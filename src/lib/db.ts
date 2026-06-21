import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const isVercel = process.env.VERCEL === "1";
const sqliteUrl = process.env.DATABASE_URL;

if (isVercel && sqliteUrl?.startsWith("file:")) {
  const filePath = sqliteUrl.replace("file:./", "").replace("file:", "");
  const runtimePath = path.join("/tmp", path.basename(filePath));
  process.env.DATABASE_URL = `file:${runtimePath}`;

  if (!fs.existsSync(runtimePath)) {
    fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
    try {
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    } catch (error) {
      console.error("Prisma migrate deploy failed on Vercel runtime:", error);
    }
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
