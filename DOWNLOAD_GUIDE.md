# Portfolio Website - Complete Source Code

## 📁 Project Structure

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main portfolio page (Hero, About, Projects, Contact)
│   │   ├── layout.tsx             # Root layout with metadata
│   │   └── globals.css             # Global styles, dark theme, design tokens
│   │   ├── api/
│   │   │   ├── contact/route.ts   # POST: Submit contact form
│   │   │   └── messages/route.ts  # GET/PATCH/DELETE: Manage messages
│   │   └── admin/
│   │       └── messages/page.tsx  # Admin panel to view messages
│   ├── components/
│   │   ├── Navigation.tsx         # Responsive navigation bar
│   │   ├── ScrollToTop.tsx        # Scroll to top button
│   │   ├── ProjectCard.tsx         # Reusable project card
│   │   ├── ImageModal.tsx          # Image lightbox modal
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/                       # React hooks
│   └── lib/
│       └── db.ts                  # Prisma database client
├── prisma/
│   └── schema.prisma              # Database schema (ContactMessage model)
├── public/
│   ├── images/                    # Your profile image goes here
│   └── generated/                  # AI-generated images
├── db/
│   └── custom.db                  # SQLite database
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind CSS config
└── .env.example                   # Environment variables template
```

---

## 🎨 Design System

### Dark Theme Colors (globals.css)

```css
.dark {
  --background: oklch(0.18 0.03 250);      /* Navy/deep blue background */
  --foreground: oklch(0.92 0.01 250);      /* Text color */
  --primary: oklch(0.75 0.12 180);         /* Cyan/teal accent */
  --primary-foreground: oklch(0.18 0.03 250); /* Text on primary */
  --card: oklch(0.23 0.03 250);            /* Card background */
  --border: oklch(0.92 0.01 250 / 15%);      /* Subtle borders */
}
```

### Spacing Scale

- 0.5rem = 8px
- 1rem = 16px
- 1.5rem = 24px
- 2rem = 32px
- 3rem = 48px
- 4rem = 64px

### Typography

- Display: 3.5rem (56px)
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- Caption: 0.75rem (12px)

---

## 🔑 Database Schema (prisma/schema.prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 📡 API Endpoints

### POST /api/contact
Submit contact form messages

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a project..."
}
```

**Response:**
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

### GET /api/messages
Retrieve all messages (requires admin password)

**Headers:**
```
Authorization: Bearer your-admin-password
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "clxxx",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Your message...",
      "read": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### PATCH /api/messages
Mark messages as read/unread

**Request:**
```json
{
  "ids": ["clxxx1", "clxxx2"],
  "read": true
}
```

### DELETE /api/messages
Delete messages

**Request:**
```json
{
  "ids": ["clxxx1", "clxxx2"]
}
```

---

## 📦 Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^15.3.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5",
    "@prisma/client": "^6.19.1",
    "z-ai-web-dev-sdk": "^1.0.0",
    "lucide-react": "^0.263.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "prisma": "^6.19.1",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.49",
    "typescript": "^5",
    "eslint": "^9.16.0",
    "eslint-config-next": "^15.0.4"
  }
}
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Setup Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env and set your admin password
echo "ADMIN_PASSWORD=your-secure-password" >> .env

# Push schema to database
bun run db:push
```

### 3. Add Profile Image
```bash
# Place your photo in public/images
cp your-photo.jpg public/images/profile.png
```

### 4. Run Development Server
```bash
bun run dev
```

Visit: http://localhost:3000

### 5. Build for Production
```bash
bun run build
bun start
```

---

## 📝 Customization

### Change Your Name
Edit: `src/app/page.tsx` (lines ~228, 231)
```tsx
<h1>[YOUR NAME]</h1>
<p>Hi, I am [YOUR NAME]</p>
```

### Update Social Links
Edit: `src/app/page.tsx` (contact section)
```tsx
<Button onClick={() => window.open('https://github.com/YOUR_USERNAME', '_blank')}>
  GitHub
</Button>
```

### Update Telegram Channel
Edit: `src/app/page.tsx` (telegram section)
```tsx
<Button onClick={() => window.open('https://t.me/YOUR_CHANNEL', '_blank')}>
  Join My Telegram Channel
</Button>
```

### Add Your Own Images
Place images in: `public/images/`
```tsx
// Then reference them
<img src="/images/your-image.png" alt="Description" />
```

---

## 🔐 Security

### Admin Password
Set in `.env`:
```
ADMIN_PASSWORD=your-secure-password
```

### Environment Variables
Never commit `.env` to version control!

### Database
For production, consider using PostgreSQL or MySQL instead of SQLite.

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 📚 Documentation Files

- `README.md` - Project overview
- `CUSTOMIZATION.md` - Detailed customization guide
- `PROFILE_AND_MESSAGES_SETUP.md` - Profile and messages setup
- `worklog.md` - Development work log

---

## ✨ Features Implemented

### ✅ Frontend
- Dark theme with navy background and cyan accents
- Responsive design (mobile, tablet, desktop)
- Smooth scrolling
- Sticky footer
- Navigation with active section highlighting
- Scroll-to-top button
- Image modal for certificates/projects
- Hover effects and animations
- Profile image display

### ✅ Backend
- Contact form with database storage
- Admin messages panel at `/admin/messages`
- Password authentication for admin
- View, mark read, delete messages
- Bulk operations support
- Message validation
- Error handling

### ✅ Database
- SQLite database with Prisma ORM
- ContactMessage model
- User model
- Post model (for blog)

### ✅ API
- RESTful endpoints
- Authentication with Bearer tokens
- Validation and error handling
- CRUD operations for messages

---

## 🎯 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Database**: Prisma ORM with SQLite
- **Icons**: Lucide React
- **State**: React Hooks (useState, useEffect)
- **Forms**: Controlled components with validation
- **API**: Next.js API Routes

---

## 📄 License

This project is open source. Modify and use as needed.

---

**For more details, see:**
- `CUSTOMIZATION.md` - How to customize everything
- `PROFILE_AND_MESSAGES_SETUP.md` - Profile and messages features
- `worklog.md` - Development history
