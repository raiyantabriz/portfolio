# Contact Form & Draggable Profile Image - Usage Guide

## 🎉 New Features Added

### 1. Draggable/Moveable Profile Image

You now have a **draggable profile image** on your website that visitors can move around the screen!

#### Features:
- ✅ Draggable anywhere on the screen (mouse & touch)
- ✅ Upload your own profile photo
- ✅ Position is saved (persists across page reloads)
- ✅ Remove/change photo easily
- ✅ Green "online" status indicator
- ✅ Shows "Add Photo" or "Change" button on hover
- ✅ Responsive size (smaller on mobile)
- ✅ First-time visitors see a helpful hint

#### How to Use:

1. **Add Your Photo:**
   - Hover over the profile image
   - Click the "Add Photo" button at the bottom
   - Select an image from your device
   - The image will be saved and displayed

2. **Move the Image:**
   - Click and drag the image anywhere on the screen
   - Position is automatically saved
   - Works with mouse (desktop) and touch (mobile)

3. **Remove Your Photo:**
   - Hover over the image
   - Click the "×" button at the top-right
   - Confirm removal
   - The placeholder icon will appear again

4. **Position Reset:**
   - To reset to default position, open browser console
   - Run: `localStorage.removeItem('profileImagePosition')`
   - Refresh the page

---

### 2. Contact Form Backend

Your contact form now saves all messages to a database! You can view and manage all messages.

#### API Endpoints Created:

**Submit Message:**
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Visitor Name",
  "email": "visitor@email.com",
  "message": "Your message here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully!",
  "data": {
    "id": "unique_message_id",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Get All Messages:**
```http
GET /api/contact
GET /api/contact?unreadOnly=true  // Only unread messages

Response:
{
  "success": true,
  "messages": [...],
  "count": 5
}
```

**Mark Message as Read:**
```http
PATCH /api/messages/{message_id}

Response:
{
  "success": true,
  "message": "Message marked as read",
  "data": { /* updated message */ }
}
```

**Delete Message:**
```http
DELETE /api/messages/{message_id}

Response:
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

### 3. Messages Dashboard

Visit `/messages` to view all messages sent through your contact form!

#### Features:
- ✅ View all messages with sender name, email, and timestamp
- ✅ See which messages are unread (highlighted with cyan border)
- ✅ Mark messages as read
- ✅ Delete messages
- ✅ Copy sender email to clipboard
- ✅ Refresh messages list
- ✅ Count of total and unread messages
- ✅ Clean, responsive dark theme

#### How to Access:

1. Go to: `http://localhost:3000/messages`
2. Or if deployed: `https://yourdomain.com/messages`
3. All messages from your contact form will be displayed

---

### 4. Database Schema

Messages are stored in the `ContactMessage` table in your database:

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

---

## 📋 Form Validation

The contact form validates:
- **Name:** Required, max 100 characters
- **Email:** Required, valid email format, max 255 characters
- **Message:** Required, max 5000 characters

---

## 🎨 User Experience

### For Visitors:
1. **Submit a message:**
   - Fill out the contact form in the "Get In Touch" section
   - Click "Send Message"
   - See success confirmation: "Message sent successfully! I'll get back to you soon."
   - Or error message if something goes wrong

2. **Loading state:**
   - While sending, button shows "Sending..." with a spinner
   - Button is disabled during submission
   - Prevents duplicate submissions

3. **Form reset:**
   - After successful submission, form is cleared
   - Success message shows for 5 seconds
   - Then automatically disappears

### For You (Portfolio Owner):

1. **View Messages:**
   - Visit `/messages` to see all contact form submissions
   - Unread messages are highlighted with cyan border and "New" badge
   - Read messages have normal appearance

2. **Manage Messages:**
   - Click "✓" to mark as read
   - Click "🗑" to delete a message (with confirmation)
   - Click "📋" to copy sender's email
   - Use "Refresh" to check for new messages

3. **Stay Updated:**
   - Visit `/messages` regularly to check for new messages
   - Unread count is shown in header
   - New messages are marked for easy identification

---

## 🔧 Technical Details

### Files Modified/Created:

1. **Database Schema:** `prisma/schema.prisma` (already had ContactMessage model)
2. **API Endpoints:**
   - `src/app/api/contact/route.ts` - POST & GET for messages
   - `src/app/api/messages/[id]/route.ts` - PATCH & DELETE for single message
3. **Components:**
   - `src/components/DraggableProfileImage.tsx` - Draggable profile photo
4. **Pages:**
   - `src/app/page.tsx` - Updated contact form with API integration
   - `src/app/messages/page.tsx` - New messages dashboard

### Database Location:

- **Development:** SQLite database in project root
- **Production:** Depends on your `DATABASE_URL` environment variable

---

## 🚀 Deployment Notes

### Before Deploying:

1. **Set Up Database:**
   - Ensure `DATABASE_URL` environment variable is set
   - For production, use a hosted database (PostgreSQL, MySQL, etc.)

2. **Protect Messages Page (Optional):**
   - Currently `/messages` is public
   - Add authentication if you want to restrict access
   - Example: Add simple password protection or auth middleware

3. **Contact Form:**
   - Form works as-is on deployment
   - Messages will be saved to your database
   - Check `/messages` page to view them

---

## 💡 Tips

### For Profile Image:
- Use a square or circular image for best results
- Recommended size: 400x400 pixels
- File formats: JPG, PNG, WebP
- Image is stored in browser's localStorage (up to ~5-10MB)

### For Contact Form:
- Test the form before going live
- Check `/messages` page to ensure submissions work
- Respond to messages promptly through the copied emails
- Consider setting up email forwarding from `/messages`

### For Database:
- Regular backups are recommended
- Monitor database size (especially if you get many messages)
- Use Prisma Studio to inspect database: `bunx prisma studio`

---

## 🐛 Troubleshooting

### Profile Image Not Showing:
- Check browser console for errors
- Try clearing browser cache and reloading
- Ensure image file size is reasonable (under 5MB)

### Messages Not Saving:
- Check `DATABASE_URL` environment variable
- Run `bun run db:push` to ensure schema is up-to-date
- Check database file permissions

### Can't Access `/messages`:
- Ensure the route compiled successfully
- Check for 404 or 500 errors
- Restart development server: `bun run dev`

---

## 📊 API Response Examples

### Success Response:
```json
{
  "success": true,
  "message": "Your message has been sent successfully!",
  "data": {
    "id": "cl1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response:
```json
{
  "error": "Invalid email address"
}
```

---

## 🎯 Next Steps

1. **Customize Your Profile:**
   - Upload your own profile photo
   - Position it where you want on the screen
   - Check on different devices (mobile, tablet, desktop)

2. **Test Contact Form:**
   - Submit a test message through the form
   - Verify it appears in `/messages`
   - Check that email and message display correctly

3. **Set Up Email Notifications (Optional):**
   - Add email sending to the `/api/contact` endpoint
   - Get notified when new messages arrive
   - Use SendGrid, AWS SES, or your SMTP server

4. **Add Authentication (Recommended):**
   - Protect `/messages` route with password
   - Or add full authentication system
   - Ensure only you can access messages

---

## 📝 Summary

✅ **Draggable Profile Image:** Fully functional with upload, drag, and position saving
✅ **Contact Form Backend:** Complete with validation and database storage
✅ **Messages Dashboard:** Clean UI to view and manage all submissions
✅ **API Endpoints:** POST, GET, PATCH, DELETE all working
✅ **Responsive Design:** Works on mobile, tablet, and desktop
✅ **Dark Theme:** Matches your portfolio's aesthetic
✅ **User-Friendly:** Success/error messages, loading states, clear UI

Your portfolio now has a fully functional contact system with a personalized, interactive profile image!
