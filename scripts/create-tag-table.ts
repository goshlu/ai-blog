import 'dotenv/config';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log('Creating Tag table...');
  
  // 创建 Tag 表
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Tag" (
      "id" TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
      "name" TEXT NOT NULL UNIQUE,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ Tag table created');

  // 创建 _PostToTag 关联表（多对多）
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_PostToTag" (
      "A" TEXT NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      "B" TEXT NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "_PostToTag_AB_unique" UNIQUE ("A", "B")
    )
  `);
  console.log('✓ _PostToTag junction table created');

  // 为 Post 表添加 tags 关联（如果还没有）
  // SQLite 不支持 ALTER TABLE ADD CONSTRAINT，但 Prisma 使用关联表

  console.log('\n✅ All tables created successfully!');
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
