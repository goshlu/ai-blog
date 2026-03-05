import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { posts } from '../src/lib/posts';
import { notes } from '../src/lib/notes';
import { thoughts } from '../src/lib/thoughts';

const adapter = new PrismaLibSql({
  url: 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 清空现有数据
  await prisma.thought.deleteMany();
  await prisma.note.deleteMany();
  await prisma.post.deleteMany();

  // 迁移文章
  console.log('Migrating posts...');
  for (const post of posts) {
    await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        content: post.content,
      },
    });
  }
  console.log(`Migrated ${posts.length} posts`);

  // 迁移手记
  console.log('Migrating notes...');
  for (const note of notes) {
    await prisma.note.create({
      data: {
        id: note.id,
        title: note.title,
        date: note.date,
        content: note.content,
        mood: note.mood,
        weather: note.weather,
      },
    });
  }
  console.log(`Migrated ${notes.length} notes`);

  // 迁移思考
  console.log('Migrating thoughts...');
  for (const thought of thoughts) {
    await prisma.thought.create({
      data: {
        id: thought.id,
        content: thought.content,
        date: thought.date,
      },
    });
  }
  console.log(`Migrated ${thoughts.length} thoughts`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
