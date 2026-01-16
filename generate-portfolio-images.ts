import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'portfolio-images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateImage(prompt, filename, size = '1024x1024') {
  console.log(`Generating ${filename}...`);
  try {
    const zai = await ZAI.create();
    const response = await zai.images.generations.create({
      prompt: prompt,
      size: size
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response from image generation API');
    }

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);

    console.log(`✓ Generated: ${filename}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to generate ${filename}:`, error.message);
    return false;
  }
}

async function generatePortfolioImages() {
  console.log('Starting portfolio image generation...\n');

  // Certificate images
  console.log('Generating certificate images...');
  await generateImage(
    'Professional IT certificate with gold border, modern design, dark navy background with cyan accents',
    'certificate-1.png',
    '1024x1024'
  );
  await generateImage(
    'Cybersecurity certification document, professional layout, navy blue theme, elegant design',
    'certificate-2.png',
    '1024x1024'
  );
  await generateImage(
    'Web development certificate, clean modern design, teal accents on dark background',
    'certificate-3.png',
    '1024x1024'
  );
  await generateImage(
    'OSINT training certificate, professional document with holographic effects, dark theme',
    'certificate-4.png',
    '1024x1024'
  );

  // Web Development Project screenshots
  console.log('\nGenerating web development project images...');
  await generateImage(
    'Modern e-commerce website homepage, clean UI, dark theme with cyan accents, professional design',
    'web-project-1.png',
    '1344x768'
  );
  await generateImage(
    'Dashboard interface with charts and analytics, modern dark theme, teal accent colors',
    'web-project-2.png',
    '1344x768'
  );
  await generateImage(
    'Social media application interface, sleek modern design, navy background with glowing accents',
    'web-project-3.png',
    '1344x768'
  );
  await generateImage(
    'Portfolio website landing page, minimalist design, dark theme with cyan highlights',
    'web-project-4.png',
    '1344x768'
  );

  // OSINT Work Showcase images
  console.log('\nGenerating OSINT work showcase images...');
  await generateImage(
    'Phone number investigation dashboard, data visualization, dark theme, professional OSINT tool interface',
    'osint-work-1.png',
    '1344x768'
  );
  await generateImage(
    'Digital image analysis tool interface, forensic metadata display, dark theme, professional design',
    'osint-work-2.png',
    '1344x768'
  );
  await generateImage(
    'Digital footprint research visualization, network graph, connections map, dark background with cyan nodes',
    'osint-work-3.png',
    '1344x768'
  );
  await generateImage(
    'OSINT investigation report interface, timeline visualization, dark theme, professional layout',
    'osint-work-4.png',
    '1344x768'
  );

  // Cyber Security Tools images
  console.log('\nGenerating cyber security tool images...');
  await generateImage(
    'Network security scanner interface, modern dark theme, teal accent, professional cybersecurity tool',
    'security-tool-1.png',
    '1344x768'
  );
  await generateImage(
    'Password strength analyzer dashboard, clean interface, dark theme with cyan highlights',
    'security-tool-2.png',
    '1344x768'
  );
  await generateImage(
    'Vulnerability assessment tool interface, modern design, navy background, professional security tool',
    'security-tool-3.png',
    '1344x768'
  );
  await generateImage(
    'Threat intelligence dashboard, cyber security monitoring tool, dark theme, professional layout',
    'security-tool-4.png',
    '1344x768'
  );

  console.log('\n✓ Portfolio image generation complete!');
}

generatePortfolioImages();
