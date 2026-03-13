import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { posts } from '../src/lib/posts';
import { notes } from '../src/lib/notes';
import { thoughts } from '../src/lib/thoughts';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  await prisma.thought.deleteMany();
  await prisma.note.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.post.deleteMany();

  console.log('Seeding posts...');
  for (const post of posts) {
    await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        content: post.content,
        tags: {
          connectOrCreate: post.tags.split(',').map((tagName) => ({
            where: { name: tagName.trim() },
            create: { name: tagName.trim() },
          })),
        },
      },
    });
  }
  console.log(`Seeded ${posts.length} posts`);

  console.log('Seeding notes...');
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
  console.log(`Seeded ${notes.length} notes`);

  console.log('Seeding thoughts...');
  for (const thought of thoughts) {
    await prisma.thought.create({
      data: {
        id: thought.id,
        content: thought.content,
        date: thought.date,
      },
    });
  }
  console.log(`Seeded ${thoughts.length} thoughts`);

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
