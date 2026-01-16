import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SUPPORTED_SIZES = [
  '1024x1024',
  '768x1344',
  '864x1152',
  '1344x768',
  '1152x864',
  '1440x720',
  '720x1440',
] as const;

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const GENERATED_DIR = path.join(PUBLIC_DIR, 'generated');

// Ensure generated directory exists
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

function generateCacheKey(prompt: string, size: string): string {
  return crypto.createHash('md5').update(`${prompt}-${size}`).digest('hex');
}

function generateFilename(prompt: string, size: string, index?: number): string {
  const cacheKey = generateCacheKey(prompt, size);
  const suffix = index !== undefined ? `_${index}` : '';
  return `${cacheKey}${suffix}.png`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = '1024x1024', count = 1 } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate size
    if (!SUPPORTED_SIZES.includes(size)) {
      return NextResponse.json(
        {
          error: `Invalid size. Supported sizes: ${SUPPORTED_SIZES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate count
    if (typeof count !== 'number' || count < 1 || count > 5) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    const results = [];

    for (let i = 0; i < count; i++) {
      try {
        // Generate image
        const response = await zai.images.generations.create({
          prompt,
          size,
        });

        if (!response.data || !response.data[0] || !response.data[0].base64) {
          throw new Error('Invalid response from image generation API');
        }

        const imageBase64 = response.data[0].base64;
        const buffer = Buffer.from(imageBase64, 'base64');

        // Generate filename
        const filename = generateFilename(prompt, size, count > 1 ? i : undefined);
        const filepath = path.join(GENERATED_DIR, filename);

        // Save image
        fs.writeFileSync(filepath, buffer);

        // Add to results
        results.push({
          success: true,
          imageUrl: `/generated/${filename}`,
          filename,
          prompt,
          size,
          fileSize: buffer.length,
          index: i + 1,
        });
      } catch (error: any) {
        console.error(`Error generating image ${i + 1}:`, error.message);
        results.push({
          success: false,
          error: error.message,
          index: i + 1,
        });
      }
    }

    // Return results
    const successCount = results.filter((r) => r.success).length;
    return NextResponse.json({
      success: successCount > 0,
      total: count,
      successful: successCount,
      failed: count - successCount,
      results,
    });
  } catch (error: any) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
