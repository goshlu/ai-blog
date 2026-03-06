/**
 * 验证数据库连接配置
 * 运行: npx tsx scripts/verify-db.ts
 */

import prisma from "../src/lib/db";

async function verifyDatabase() {
  console.log("🔍 验证数据库配置...\n");

  // 检查环境变量
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  console.log("环境变量:");
  console.log(`  TURSO_DATABASE_URL: ${tursoUrl ? "✓ 已设置" : "✗ 未设置"}`);
  console.log(
    `  TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? "✓ 已设置" : "✗ 未设置"}`,
  );
  console.log(`  DATABASE_URL: ${databaseUrl || "(使用默认值)"}\n`);

  // 判断使用的数据库类型
  if (tursoUrl && tursoUrl.startsWith("libsql://")) {
    console.log("📡 使用 Turso 云数据库");
    console.log(`   URL: ${tursoUrl}\n`);
  } else {
    console.log("💾 使用本地 SQLite 数据库");
    console.log(`   URL: ${databaseUrl || "file:./prisma/dev.db"}\n`);
  }

  // 测试连接
  try {
    console.log("🔌 测试数据库连接...");
    await prisma.$connect();
    console.log("✅ 数据库连接成功！\n");

    // 查询统计
    const [postCount, tagCount, noteCount, thoughtCount] = await Promise.all([
      prisma.post.count(),
      prisma.tag.count(),
      prisma.note.count(),
      prisma.thought.count(),
    ]);

    console.log("📊 数据库统计:");
    console.log(`   文章: ${postCount}`);
    console.log(`   标签: ${tagCount}`);
    console.log(`   手记: ${noteCount}`);
    console.log(`   思考: ${thoughtCount}\n`);

    console.log("✨ 数据库配置验证完成！");
  } catch (error) {
    console.error("❌ 数据库连接失败:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
