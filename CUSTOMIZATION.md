# Portfolio Website - Customization Guide

This guide will help you customize and replace the placeholder content in your portfolio website.

## Table of Contents
1. [Profile Image](#profile-image)
2. [Personal Information](#personal-information)
3. [Certificates](#certificates)
4. [Projects](#projects)
5. [OSINT Work Showcase](#osint-work-showcase)
6. [Cyber Security Tools](#cyber-security-tools)
7. [Social Links](#social-links)
8. [Telegram Channel](#telegram-channel)
9. [Contact Information](#contact-information)
10. [Image Generation API](#image-generation-api)
11. [Contact Messages API](#contact-messages-api)

---

## Profile Image

### Add Your Profile Photo

**Location:** `src/app/page.tsx` (lines 200-206)

Your portfolio includes a moveable profile image in the hero section that visitors can drag around. Replace the placeholder with your own photo:

```tsx
<MoveableImage
  src="/images/your-profile-photo.png"  // Replace with your image path
  alt="Profile"
  size={180}
  initialX={20}
  initialY={100}
/>
```

**Tips:**
- Use a square or circular image (recommended size: 300x300 pixels)
- Store your image in the `public/images/` folder
- The image can be dragged around the screen by visitors
- Default position: top-left corner (20px from left, 100px from top)
- You can adjust `size`, `initialX`, and `initialY` values

**Customize Image Behavior:**

```tsx
<MoveableImage
  src="/images/your-photo.jpg"           // Path to your image
  alt="Your Name"                      // Alt text for accessibility
  size={200}                             // Size in pixels (default: 200)
  initialX={50}                          // Initial X position from left
  initialY={150}                         // Initial Y position from top
/>
```

---

## Personal Information

### Replace Your Name

**Files to edit:**
- `src/app/page.tsx` (line 171, 174, 177)
- `src/app/layout.tsx` (line 17, 20, 25, 31)

**Example:**
```tsx
// In src/app/page.tsx
<h1 className="...">
  John Doe
</h1>
<p className="...">
  Hi, I am John Doe
</p>

// In src/app/layout.tsx
export const metadata: Metadata = {
  title: "John Doe - Frontend Developer & OSINT Expert",
  // ...
};
```

---

## Certificates

### Update Certificate Images

**Location:** `src/app/page.tsx` (lines 47-68)

Replace the placeholder image URLs with your actual certificate images:

```tsx
const certificates = [
  {
    id: 1,
    title: 'Your Certificate Title',
    imageUrl: '/images/certificate-1.png', // Path to your image in /public folder
  },
  {
    id: 2,
    title: 'Your Second Certificate',
    imageUrl: '/images/certificate-2.png',
  },
  // Add more certificates as needed
];
```

**Tips:**
- Store your certificate images in the `public/images/` folder
- Use 1:1 aspect ratio (square) images for best results
- Recommended size: 1024x1024 pixels
- Images can be PNG or JPG format

---

## Projects

### Web Development Projects

**Location:** `src/app/page.tsx` (lines 71-96)

```tsx
const webProjects = [
  {
    title: 'Your Project Title',
    description: 'A brief description of what the project does...',
    imageUrl: '/images/project-1.png',
    tags: ['React', 'Next.js', 'TypeScript'],
  },
  // Add more projects
];
```

### OSINT Work Showcase

**Location:** `src/app/page.tsx` (lines 99-124)

```tsx
const osintWork = [
  {
    title: 'Your OSINT Investigation',
    description: 'Description of the investigation...',
    imageUrl: '/images/osint-1.png',
    tags: ['OSINT', 'Analysis', 'Investigation'],
  },
  // Add more OSINT work
];
```

### Cyber Security Tools

**Location:** `src/app/page.tsx` (lines 127-152)

```tsx
const securityTools = [
  {
    title: 'Your Tool Name',
    description: 'Description of what the tool does...',
    imageUrl: '/images/tool-1.png',
    tags: ['Security', 'Tool', 'Analysis'],
  },
  // Add more tools
];
```

**Tips:**
- For project thumbnails, use 16:9 aspect ratio (landscape)
- Recommended size: 1344x768 or 1920x1080 pixels
- Add relevant tech tags for better presentation

---

## Social Links

**Location:** `src/app/page.tsx` (lines 503-531)

Update your social media URLs:

```tsx
<Button onClick={() => window.open('https://github.com/YOUR_USERNAME', '_blank')}>
  <Github className="mr-3 h-5 w-5" />
  GitHub
</Button>

<Button onClick={() => window.open('https://linkedin.com/in/YOUR_PROFILE', '_blank')}>
  <Linkedin className="mr-3 h-5 w-5" />
  LinkedIn
</Button>

<Button onClick={() => window.open('mailto:your@email.com')}>
  <Mail className="mr-3 h-5 w-5" />
  Email
</Button>

<Button onClick={() => window.open('https://t.me/YOUR_USERNAME', '_blank')}>
  <Telegram className="mr-3 h-5 w-5" />
  Telegram
</Button>
```

---

## Telegram Channel

**Location:** `src/app/page.tsx` (line 409)

Replace the Telegram channel URL:

```tsx
<Button onClick={() => window.open('https://t.me/YOUR_CHANNEL_NAME', '_blank')}>
  <Telegram className="mr-2 h-5 w-5" />
  Join My Telegram Channel
</Button>
```

---

## Contact Information

**Location:** `src/app/page.tsx` (lines 542-551)

Update your quick info:

```tsx
<div className="space-y-3 text-sm text-muted-foreground">
  <div className="flex items-center gap-3">
    <Globe className="h-4 w-4 text-primary" />
    <span>Based: Your City, Country</span>
  </div>
  <div className="flex items-center gap-3">
    <Phone className="h-4 w-4 text-primary" />
    <span>Available: Remote / On-site / Hybrid</span>
  </div>
  <div className="flex items-center gap-3">
    <Terminal className="h-4 w-4 text-primary" />
    <span>Open to: Projects & Consultations</span>
  </div>
</div>
```

---

## Image Generation API

You can use the built-in API endpoint to generate placeholder images or create custom images for your portfolio.

### API Endpoint

**URL:** `/api/generate-image`

**Method:** `POST`

**Request Body:**

```json
{
  "prompt": "A modern e-commerce dashboard interface",
  "size": "1344x768",
  "count": 1
}
```

**Supported Sizes:**
- `1024x1024` - Square (good for certificates)
- `768x1344` - Portrait (good for phone screenshots)
- `864x1152` - Portrait
- `1344x768` - Landscape (good for project thumbnails)
- `1152x864` - Landscape
- `1440x720` - Wide landscape (good for hero images)
- `720x1440` - Tall portrait

**Example Usage with JavaScript:**

```javascript
// Generate a single image
const response = await fetch('/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Modern dark dashboard with charts and analytics',
    size: '1344x768',
    count: 1
  })
});

const result = await response.json();

if (result.success && result.results[0].success) {
  console.log('Image URL:', result.results[0].imageUrl);
}
```

**Example Usage with cURL:**

```bash
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A professional certificate design",
    "size": "1024x1024",
    "count": 1
  }'
```

**Response Format:**

```json
{
  "success": true,
  "total": 1,
  "successful": 1,
  "failed": 0,
  "results": [
    {
      "success": true,
      "imageUrl": "/generated/abc123.png",
      "filename": "abc123.png",
      "prompt": "...",
      "size": "1344x768",
      "fileSize": 123456,
      "index": 1
    }
  ]
}
```

**Note:** Generated images are saved in the `public/generated/` folder.

---

## Color Customization

The dark theme uses navy/deep blue backgrounds with neon cyan/teal accents. To customize:

**Location:** `src/app/globals.css` (lines 81-113)

```css
.dark {
  --background: oklch(0.18 0.03 250); /* Navy/deep blue background */
  --foreground: oklch(0.92 0.01 250); /* Text color */
  --primary: oklch(0.75 0.12 180); /* Cyan/teal accent */
  --primary-foreground: oklch(0.18 0.03 250); /* Text on primary */
  /* ... more colors */
}
```

**Color Tips:**
- `oklch()` function: Lightness (0-1), Chroma (0-0.4), Hue (0-360)
- Keep contrast ratios above 4.5:1 for accessibility
- Test your colors with a contrast checker tool

---

## Adding Your Own Images

1. Create a folder `public/images` (if it doesn't exist)
2. Place your images in that folder
3. Reference them in the code as `/images/your-image.png`

**Example:**
```
public/
  images/
    certificate-1.png
    project-1.png
    osint-work-1.png
    tool-1.png
```

---

## Development

### Run Development Server

```bash
bun run dev
```

### Build for Production

```bash
bun run build
```

### Check Code Quality

```bash
bun run lint
```

---

## Deployment

Your portfolio is ready to deploy to:
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- Any Node.js hosting provider

---

## Need Help?

If you encounter any issues or need help customizing your portfolio, check:
- Next.js documentation: https://nextjs.org/docs
- Tailwind CSS documentation: https://tailwindcss.com/docs
- shadcn/ui components: https://ui.shadcn.com

---

## Contact Messages API

Your portfolio includes a contact form that saves messages to the database. You can retrieve and manage these messages using the API.

### Contact Form API (Submit Messages)

**URL:** `/api/contact`

**Method:** `POST`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a project for you..."
}
```

**Validation Rules:**
- Name: Minimum 2 characters
- Email: Must be a valid email format
- Message: Minimum 10 characters

**Success Response:**

```json
{
  "success": true,
  "message": "Your message has been sent successfully!",
  "data": {
    "id": "clxxx",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### Messages API (Retrieve & Manage)

**URL:** `/api/messages`

#### GET - Retrieve All Messages

```bash
curl http://localhost:3000/api/messages
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "clxxx1",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Your message content...",
      "read": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    // ... more messages
  ]
}
```

#### PATCH - Mark Message as Read

```bash
curl -X PATCH http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "messageId": "clxxx1"
  }'
```

#### DELETE - Delete Message

```bash
curl -X DELETE http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "messageId": "clxxx1"
  }'
```

### Creating an Admin Page (Optional)

To easily view and manage your messages, you can create an admin page at `src/app/admin/page.tsx`:

**Security Note:** In production, you should add authentication to protect your admin routes. You can use NextAuth.js or implement your own authentication system.

