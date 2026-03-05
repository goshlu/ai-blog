import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - 获取单条手记
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  });
  
  if (!note) {
    return NextResponse.json(
      { success: false, error: '手记不存在' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true, note });
}
