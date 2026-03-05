import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - 获取所有思考
export async function GET() {
  const thoughts = await prisma.thought.findMany({
    orderBy: { date: 'desc' },
  });
  return NextResponse.json({ success: true, thoughts });
}
