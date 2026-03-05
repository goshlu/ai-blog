import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - 获取所有手记
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { date: 'desc' },
  });
  return NextResponse.json({ success: true, notes });
}
