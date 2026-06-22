import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const isVercel = process.env.VERCEL === "1";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbReady?: boolean;
};

if (isVercel) {
  process.env.DATABASE_URL = "file:/tmp/dev.db";

  if (!globalForPrisma.dbReady) {
    try {
      console.log("Initializing SQLite DB at /tmp/dev.db");

      execSync("./node_modules/.bin/prisma db push --skip-generate", {
        stdio: "inherit",
        env: {
          ...process.env,
          DATABASE_URL: "file:/tmp/dev.db",
        },
      });

      globalForPrisma.dbReady = true;
      console.log("SQLite DB initialized");
    } catch (error) {
      console.error("SQLite DB initialization failed:", error);
      throw error;
    }
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
