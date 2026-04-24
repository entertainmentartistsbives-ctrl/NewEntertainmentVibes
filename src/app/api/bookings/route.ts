import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// POST /api/bookings
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, eventType, eventDate, budget, message, artistId, artistName } = body;

    // Basic validation
    if (!name || !phone || !eventType || !eventDate || !budget) {
      return NextResponse.json(
        { success: false, error: 'Please fill all required fields.' },
        { status: 400 }
      );
    }

    // Save to DB
    const booking = await prisma.bookingLead.create({
      data: {
        name,
        phone,
        email: email || '',
        eventType,
        eventDate,
        budget,
        message: message || '',
        artistId: artistId ? parseInt(artistId) : null,
        artistName: artistName || '',
        status: 'new',
      },
    });

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_gmail_app_password_here') {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"EntertainmentVibes" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO,
          subject: `🎤 New Booking Request — ${eventType} by ${name}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#f0f0f5;border-radius:12px;overflow:hidden;">
              <div style="background:linear-gradient(135deg,#d4a843,#f0c060);padding:24px;text-align:center;">
                <h1 style="margin:0;color:#1a1200;font-size:22px;">🎤 New Booking Lead</h1>
                <p style="margin:4px 0 0;color:#1a1200;opacity:0.8;">EntertainmentVibes</p>
              </div>
              <div style="padding:32px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;width:40%;">Client Name</td><td style="padding:10px 0;border-bottom:1px solid #222;font-weight:600;">${name}</td></tr>
                  <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #222;font-weight:600;">${phone}</td></tr>
                  <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;">Email</td><td style="padding:10px 0;border-bottom:1px solid #222;">${email || 'Not provided'}</td></tr>
                  <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;">Event Type</td><td style="padding:10px 0;border-bottom:1px solid #222;">${eventType}</td></tr>
                  <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;">Event Date</td><td style="padding:10px 0;border-bottom:1px solid #222;">${eventDate}</td></tr>
                  <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;">Budget</td><td style="padding:10px 0;border-bottom:1px solid #222;color:#d4a843;font-weight:600;">${budget}</td></tr>
                  ${artistName ? `<tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#a0a0b8;">Artist Requested</td><td style="padding:10px 0;border-bottom:1px solid #222;">${artistName}</td></tr>` : ''}
                  ${message ? `<tr><td style="padding:10px 0;color:#a0a0b8;">Message</td><td style="padding:10px 0;">${message}</td></tr>` : ''}
                </table>
                <div style="margin-top:24px;padding:16px;background:#14141f;border-radius:8px;border-left:3px solid #d4a843;">
                  <p style="margin:0;font-size:13px;color:#a0a0b8;">Booking ID: #${booking.id} | Received: ${new Date().toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[Email send error]', emailErr);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (err) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json({ success: false, error: 'Failed to submit booking.' }, { status: 500 });
  }
}
