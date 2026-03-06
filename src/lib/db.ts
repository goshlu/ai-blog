import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

  // 优先使用 Turso（生产环境）
  if (tursoUrl && tursoUrl.startsWith("libsql://")) {
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    return new PrismaClient({ adapter });
  }

  // 回退到本地 SQLite（开发环境）
  // Prisma 7.x 要求所有连接都使用 adapter
  const adapter = new PrismaLibSql({
    url: databaseUrl,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
