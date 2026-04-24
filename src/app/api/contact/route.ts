import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// POST /api/contact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Please fill all required fields.' },
        { status: 400 }
      );
    }

    // Save to DB
    const contact = await prisma.contactMessage.create({
      data: { name, phone, message },
    });

    // Email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_gmail_app_password_here') {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: false,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
          from: `"EntertainmentVibes" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO,
          subject: `📩 New Contact Message from ${name}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;background:#0a0a0f;color:#f0f0f5;border-radius:12px;overflow:hidden;">
              <div style="background:linear-gradient(135deg,#d4a843,#f0c060);padding:20px 24px;">
                <h1 style="margin:0;color:#1a1200;font-size:20px;">📩 New Contact Message</h1>
              </div>
              <div style="padding:28px;">
                <p><strong style="color:#a0a0b8;">Name:</strong> ${name}</p>
                <p><strong style="color:#a0a0b8;">Phone:</strong> ${phone}</p>
                <p style="margin-top:12px;"><strong style="color:#a0a0b8;">Message:</strong><br/>${message}</p>
                <p style="margin-top:20px;font-size:12px;color:#606078;">Received: ${new Date().toLocaleString('en-IN')}</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[Contact email error]', emailErr);
      }
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (err) {
    console.error('[POST /api/contact]', err);
    return NextResponse.json({ success: false, error: 'Failed to send message.' }, { status: 500 });
  }
}
