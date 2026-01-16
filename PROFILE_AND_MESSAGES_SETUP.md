# Profile Image and Contact Messages Setup

## What's Been Implemented

### 1. Profile Image

Your portfolio now includes a **static profile image** in the hero section with:

- **Location**: Hero section at the top of the page
- **Design**: Circular image with cyan accent border
- **Effects**: Hover scale and glow effects
- **Image Path**: `/images/profile.png`

#### How to Add Your Profile Photo

1. Place your photo in the `public/images/` folder
2. Name it `profile.png` or `profile.jpg`
3. Recommended size: 400x400 pixels (square)
4. Supported formats: PNG, JPG, JPEG, WEBP

**Example:**
```bash
# If your photo is named my-photo.jpg:
cp my-photo.jpg public/images/profile.png
```

### 2. Contact Form Backend

The contact form now **saves messages to a database** with full functionality:

#### Features:
- ✅ Messages stored in SQLite database
- ✅ Validation (name, email format, message content)
- ✅ Success message after submission
- ✅ Error message if submission fails
- ✅ Loading spinner during submission
- ✅ Form auto-reset after successful submission

#### API Endpoints

**POST** `/api/contact` - Submit contact form
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a project for you..."
}
```

### 3. Admin Messages Panel

A **complete admin dashboard** at `/admin/messages` to manage your messages:

#### Features:
- 🔐 **Password-protected** authentication
- 📬 View all contact messages
- ✅ Mark messages as read/unread
- 🗑️ Delete messages (single or multiple)
- 📋 Select multiple messages for bulk operations
- 💾 Session persistence (stay logged in across page reloads)
- 📊 Message counter (total and unread count)
- 🆕 "New" badge for unread messages
- ⏰ Formatted timestamps
- 🎨 Dark theme matching your portfolio

#### How to Access Admin Panel

1. Visit `http://localhost:3000/admin/messages` (or your domain)
2. Enter your admin password
3. View, read, and manage all messages

#### Setting Up Admin Password

The admin panel uses the `ADMIN_PASSWORD` environment variable.

**Create/Edit `.env` file:**
```bash
ADMIN_PASSWORD=your-secure-password-here
```

Or use the provided `.env.example` as a template:

```bash
cp .env.example .env
# Then edit .env and change ADMIN_PASSWORD to your secure password
```

## How It Works

### Contact Form Flow:

1. Visitor fills out the contact form
2. Clicks "Send Message" button
3. Form validates input (name, email, message)
4. Sends to `/api/contact` endpoint
5. Message is saved to database with:
   - Unique ID
   - Sender name
   - Sender email
   - Message content
   - Read status (default: false)
   - Timestamp
6. Success message shown to visitor
7. Form resets automatically

### Admin Panel Flow:

1. You visit `/admin/messages`
2. Enter admin password (stored in localStorage)
3. See all messages with:
   - Sender name and email
   - Message content
   - Timestamp (formatted)
   - Read/unread status (visual distinction)
4. Perform actions:
   - **Mark as Read**: Click "Mark Read" after selecting messages
   - **Delete**: Click "Delete" after selecting messages
   - **Copy Email**: Click email address to copy to clipboard
   - **Select Multiple**: Checkboxes to select multiple messages
5. Logout when done

## Database

### ContactMessage Model

The database uses the following schema:

```prisma
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### Database File

- **Type**: SQLite
- **Location**: `db/custom.db`
- **Status**: Already synced and ready

## API Reference

### Get All Messages (Protected)

```bash
curl http://localhost:3000/api/messages \
  -H "Authorization: Bearer your-admin-password"
```

### Get Unread Messages Only

```bash
curl http://localhost:3000/api/messages?unread=true \
  -H "Authorization: Bearer your-admin-password"
```

### Mark Messages as Read

```bash
curl -X PATCH http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-password" \
  -d '{
    "ids": ["message-id-1", "message-id-2"],
    "read": true
  }'
```

### Delete Messages

```bash
curl -X DELETE http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-password" \
  -d '{
    "ids": ["message-id-1", "message-id-2"]
  }'
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change the Default Password**: The example password `your-secure-admin-password-change-this` is NOT secure
2. **Use Strong Passwords**: At least 12 characters with mix of letters, numbers, and symbols
3. **Environment Variables**: Never commit `.env` file to version control
4. **Production Auth**: In production, consider using NextAuth.js for more secure authentication
5. **HTTPS**: Ensure your site is served over HTTPS in production
6. **Database**: SQLite is fine for development, consider PostgreSQL/MySQL for production

## Troubleshooting

### "Invalid password" error

- Make sure ADMIN_PASSWORD is set in `.env` file
- Check for typos in password
- Restart dev server after changing `.env`

### Can't see messages

- Check database file exists at `db/custom.db`
- Run `bun run db:push` to sync schema
- Check console for errors in browser dev tools

### Contact form not working

- Check `/api/contact` endpoint exists in `src/app/api/contact/route.ts`
- Check database client is imported in `src/lib/db.ts`
- Run `bun run db:push` to sync database

## Next Steps

1. ✅ Add your profile photo to `public/images/profile.png`
2. ✅ Set your admin password in `.env` file
3. ✅ Test contact form by submitting a message
4. ✅ Visit `/admin/messages` to view your messages
5. ✅ Mark messages as read or delete them
6. ✅ Deploy your portfolio with all features working

## Files Created/Modified

### Created:
- `src/app/admin/messages/page.tsx` - Admin messages panel
- `src/app/admin/page.tsx` - Admin redirect
- `src/app/api/contact/route.ts` - Contact form submission API
- `src/app/api/messages/route.ts` - Messages management API
- `public/images/README.md` - Profile image instructions
- `.env.example` - Environment variables template

### Modified:
- `src/app/page.tsx` - Added profile image, integrated contact form with backend
- `prisma/schema.prisma` - ContactMessage model already exists
- Database - Synced and ready

## Support

Check these files for more details:
- `CUSTOMIZATION.md` - Full customization guide
- `public/images/README.md` - Profile image setup
- `worklog.md` - Development work log
