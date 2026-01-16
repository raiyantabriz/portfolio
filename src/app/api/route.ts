import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
// import { Resend } from 'resend';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
// const RESEND_API_KEY = process.env.RESEND_API_KEY;

// const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD;
}

// GET - সব মেসেজ ফেচ করুন
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Please provide valid admin password.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const unrepliedOnly = searchParams.get('unreplied') === 'true';

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        AND: [
          unreadOnly ? { read: false } : {},
          unrepliedOnly ? { replied: false } : {}
        ]
      },
    });

    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error: any) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}

// POST - নতুন মেসেজ তৈরি (Contact Form থেকে)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const newMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        message,
        read: false,
        replied: false
      }
    });

    // এখানে আপনি নোটিফিকেশন ইমেইল পাঠাতে পারেন (ঐচ্ছিক)
    // if (resend) {
    //   await resend.emails.send({
    //     from: 'Portfolio <onboarding@resend.dev>',
    //     to: 'your-email@example.com',
    //     subject: 'New Message Received',
    //     html: `<p>You have a new message from ${name} (${email})</p>`
    //   });
    // }

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PATCH - মেসেজ আপডেট (Read/Reply)
export async function PATCH(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Please provide valid admin password.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { ids, read, reply, email, name } = body;

    if (ids && Array.isArray(ids) && typeof read === 'boolean') {
      // Mark as read/unread
      await db.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { read },
      });

      return NextResponse.json({
        success: true,
        message: 'Messages updated successfully',
      });
    }

    if (ids && Array.isArray(ids) && reply && email && name) {
      // Send reply
      const message = await db.contactMessage.findFirst({
        where: { id: ids[0] }
      });

      if (!message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }

      // Update message with reply
      await db.contactMessage.update({
        where: { id: ids[0] },
        data: {
          replied: true,
          reply: reply,
          repliedAt: new Date()
        }
      });

      // Send email reply to visitor (ঐচ্ছিক)
      // if (resend) {
      //   await resend.emails.send({
      //     from: 'Your Name <onboarding@resend.dev>',
      //     to: email,
      //     subject: 'Re: Your Message',
      //     html: `
      //       <h3>Hello ${name},</h3>
      //       <p>Thank you for your message. Here is my reply:</p>
      //       <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
      //         ${reply}
      //       </div>
      //       <p>Best regards,<br/>Your Name</p>
      //     `
      //   });
      // }

      return NextResponse.json({
        success: true,
        message: 'Reply sent successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating messages:', error);
    return NextResponse.json(
      { error: 'Failed to update messages' },
      { status: 500 }
    );
  }
}

// DELETE - মেসেজ ডিলিট
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Please provide valid admin password.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid message IDs' },
        { status: 400 }
      );
    }

    await db.contactMessage.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({
      success: true,
      message: 'Messages deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting messages:', error);
    return NextResponse.json(
      { error: 'Failed to delete messages' },
      { status: 500 }
    );
  }
}