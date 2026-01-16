# Profile Image

## How to Add Your Profile Image

1. Place your profile image in the `public/images/` folder
2. Name it `profile.png` or `profile.jpg`
3. Supported formats: PNG, JPG, JPEG, WEBP
4. Recommended size: 400x400 pixels (square)

### Example:

If your image is named `my-photo.jpg`, you have two options:

**Option 1:** Rename your file to `profile.png`
```
my-photo.jpg → profile.png
```

**Option 2:** Update the image source in `src/app/page.tsx`
```tsx
<img
  src="/images/my-photo.jpg"
  alt="Profile"
  className="w-full h-full object-cover"
/>
```

### Current Setup

The profile image is located in the Hero section at the top of your page.
It has:
- Circular shape with 4px border
- Cyan accent color border
- Hover effects (scale up and glow)
- Shadow effects
- Responsive design

### Tips

- Use a high-quality, professional-looking photo
- Good lighting and clear focus on your face
- Professional attire recommended
- Simple background works best
- PNG format supports transparency if needed
