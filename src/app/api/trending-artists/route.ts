import { NextResponse } from 'next/server';
import { prisma, withRetry } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: any = { isTrending: true, isActive: true };
    if (category && category !== 'ALL') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const trendingArtists = await withRetry(() =>
      prisma.artist.findMany({
        where,
        orderBy: { order: 'asc' },
      })
    );
    return NextResponse.json({ success: true, data: trendingArtists });
  } catch (error) {
    console.error('Error fetching trending artists:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch trending artists' }, { status: 500 });
  }
}
