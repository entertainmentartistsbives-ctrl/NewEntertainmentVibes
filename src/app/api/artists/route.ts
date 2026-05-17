import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/artists — list & filter artists
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get('category')  || undefined;
    const location  = searchParams.get('location')  || undefined;
    const budget    = searchParams.get('budget')     || undefined;
    const featured  = searchParams.get('featured');
    const exclusive = searchParams.get('exclusive');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    if (category)  where.category = { equals: category, mode: 'insensitive' };
    if (location)  where.location = { contains: location, mode: 'insensitive' };
    if (featured === 'true')  where.isFeatured = true;
    if (exclusive === 'true') where.isExclusive = true;

    // Budget filter (basic range parsing)
    if (budget) {
      const max = parseInt(budget);
      if (!isNaN(max)) {
        // We store price as string "₹50,000 onwards"; filter by eventsCount as proxy isn't ideal,
        // so we skip numeric filter for now and return all — real implementation needs a numeric price field.
        // Left as a no-op for first build; will add priceNumeric field later.
      }
    }

    const artists = await prisma.artist.findMany({
      where,
      orderBy: [
        { isExclusive: 'desc' },
        { isFeatured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: artists });
  } catch (err) {
    console.error('[GET /api/artists]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch artists' }, { status: 500 });
  }
}
