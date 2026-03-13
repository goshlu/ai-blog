import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAllNotes } from '@/lib/notes';

export async function GET() {
  try {
    const dbNotes = await prisma.note.findMany({
      orderBy: { date: 'desc' },
    });

    const notes = dbNotes.length > 0 ? dbNotes : getAllNotes();

    return NextResponse.json({ success: true, notes, source: dbNotes.length > 0 ? 'database' : 'static' });
  } catch (error) {
    console.error('[API/NOTES] GET Error:', error);
    return NextResponse.json({ success: true, notes: getAllNotes(), source: 'static' });
  }
}
