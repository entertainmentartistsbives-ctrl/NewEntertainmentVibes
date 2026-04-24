import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  return token === process.env.ADMIN_PASSWORD;
}

// GET /api/admin/artists — list all (including inactive)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const artists = await prisma.artist.findMany({
      orderBy: [{ isTrending: 'desc' }, { isExclusive: 'desc' }, { isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, data: artists });
  } catch (err) {
    console.error('[Admin GET artists]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch.' }, { status: 500 });
  }
}

// POST /api/admin/artists — create artist
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name, category, location, bio, price,
      imageUrl, isExclusive, isFeatured, isTrending, isActive,
      rating, eventsCount, videoUrl,
    } = body;

    if (!name || !category) {
      return NextResponse.json({ success: false, error: 'Name and category are required.' }, { status: 400 });
    }

    const dataToSave = {
      name,
      category,
      location: location || 'Mumbai',
      bio: bio || '',
      price: price || 'On Request',
      imageUrl: imageUrl || '/images/placeholder-artist.jpg',
      isExclusive: !!isExclusive,
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isActive: isActive ?? true,
      rating: (rating && !isNaN(parseFloat(rating))) ? parseFloat(rating) : 4.5,
      eventsCount: (eventsCount && !isNaN(parseInt(eventsCount))) ? parseInt(eventsCount) : 0,
      videoUrl: videoUrl || '',
    };

    console.log('[Admin POST artist] Attempting to create with data:', JSON.stringify(dataToSave, null, 2));

    const artist = await prisma.artist.create({
      data: dataToSave,
    });

    // --- Send Email Notifications to Subscribers ---
    try {
      const subscribers = await prisma.newsletterSubscriber.findMany();
      if (subscribers && subscribers.length > 0) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const emails = subscribers.map(sub => sub.email);

        const mailOptions = {
          from: `"EntertainmentVibes" <${process.env.EMAIL_USER}>`,
          bcc: emails,
          subject: `🎤 New Artist Alert: ${artist.name} (${artist.category})`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 40px 20px; text-align: center;">
              <h1 style="color: #d4a843; margin-bottom: 5px;">🎶 New ${artist.category} Available!</h1>
              <p style="color: #ccc; font-size: 16px;">We are excited to announce that <strong style="color: #fff;">${artist.name}</strong> has just been added to our roster.</p>
              ${artist.imageUrl && !artist.imageUrl.includes('placeholder') ? `<img src="${artist.imageUrl}" alt="${artist.name}" style="max-width: 100%; max-height: 400px; border-radius: 12px; margin: 20px auto; display: block;" />` : ''}
              <p style="color: #aaa;">📍 Location: ${artist.location}</p>
              ${artist.price ? `<p style="color: #aaa;">💰 Starting Price: ${artist.price}</p>` : ''}
              <p style="margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/artists" style="background-color: #d4a843; color: #000; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">View & Book Now →</a>
              </p>
              <p style="color: #555; font-size: 12px; margin-top: 40px;">You received this because you subscribed to EntertainmentVibes updates.</p>
            </div>
          `,
        };

        // Send emails in the background (don't block the response)
        transporter.sendMail(mailOptions)
          .then(() => console.log(`[Newsletter] ✅ Sent notification to ${subscribers.length} subscribers.`))
          .catch((err: any) => console.error('[Newsletter] ❌ Email send failed:', err.message));
      }
    } catch (emailErr) {
      console.error('[Newsletter Error]', emailErr);
    }

    return NextResponse.json({ success: true, data: artist });
  } catch (err: any) {
    console.error('[Admin POST artist]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to create artist.' }, { status: 500 });
  }
}
