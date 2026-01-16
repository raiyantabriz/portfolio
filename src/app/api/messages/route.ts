// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

const ADMIN_PASSWORD = 'admin123';

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

    return NextResponse.json({
      success: true,
      messages // Note: Admin Panel expects "messages" not "data"
    });
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST: Create new message (Contact Form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, message } = body;
    
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Read existing messages
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const messages = JSON.parse(fileData);

    // Create new message
    const newMessage = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString()
    };

    // Add to messages
    messages.push(newMessage);

    // Save to file
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
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

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully'
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
    const initialLength = messages.length;
    messages = messages.filter((msg: any) => msg.id !== id);

    if (messages.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    // Save to file
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}