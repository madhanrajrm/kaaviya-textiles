import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const isVercel = process.env.VERCEL === "1";

if (isVercel) {
  process.env.DATABASE_URL = "file:/tmp/dev.db";

  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: "file:/tmp/dev.db",
    },
  });
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
