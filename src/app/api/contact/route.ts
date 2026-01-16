// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'messages.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize messages file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
}

const ADMIN_PASSWORD = 'raiyeean123'; // .env.local এ যে পাসওয়ার্ড আছে

// GET: Fetch all messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Read messages from file
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const messages = JSON.parse(fileData);

    // Sort by date (newest first)
    messages.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Admin Panel expects EXACTLY this format
    return NextResponse.json({
      success: true,
      messages // NOTE: "messages" not "data"
    });
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PATCH: Update message (Mark as read)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, read } = body;

    if (!id || typeof read !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'ID and read status are required' },
        { status: 400 }
      );
    }

    // Read messages from file
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const messages = JSON.parse(fileData);

    // Find and update message
    const messageIndex = messages.findIndex((msg: any) => msg.id === id);
    
    if (messageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    messages[messageIndex].read = read;
    messages[messageIndex].updatedAt = new Date().toISOString();

    // Save to file
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    // Admin Panel expects success response
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE: Delete message
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Read messages from file
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    let messages = JSON.parse(fileData);

    // Filter out the message to delete
    messages = messages.filter((msg: any) => msg.id !== id);

    // Save to file
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    // Admin Panel expects success response
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}