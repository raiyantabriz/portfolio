'use client';

import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableProfileImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export default function DraggableProfileImage({
  src,
  alt = 'Profile',
  className,
}: DraggableProfileImageProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage (client-side only)
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profileImagePosition');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
      } else {
        // Set default position (bottom right corner)
        setPosition({ x: 20, y: 20 });
      }

      // Check if user has set their image
      const hasImage = localStorage.getItem('userProfileImage');
      setShowImage(!!hasImage);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;

      // Keep within viewport bounds
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 100);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 100);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Save position to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileImagePosition', JSON.stringify(position));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);

    const startX = touch.clientX - position.x;
    const startY = touch.clientY - position.y;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newX = touch.clientX - startX;
      const newY = touch.clientY - startY;

      // Keep within viewport bounds
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 100);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 100);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Save position to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileImagePosition', JSON.stringify(position));
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem('userProfileImage', base64);
        window.location.reload(); // Reload to show the image
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image
  const clearImage = () => {
    if (confirm('Remove your profile image?')) {
      localStorage.removeItem('userProfileImage');
      setShowImage(false);
    }
  };

  // Get current image (from localStorage or default)
  const currentImage = showImage && typeof window !== 'undefined'
    ? (localStorage.getItem('userProfileImage') as string)
    : src;

  return (
    <>
      {/* Draggable Profile Image */}
      <div
        ref={dragRef}
        className={cn(
          'fixed z-50 cursor-grab active:cursor-grabbing transition-shadow duration-200',
          'hover:shadow-2xl hover:shadow-primary/30',
          isDragging && 'shadow-2xl shadow-primary/50',
          className
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative group">
          {/* Profile Image Container */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-card">
            {currentImage ? (
              <img
                src={currentImage}
                alt={alt}
                className="w-full h-full object-cover"
                onLoad={() => setIsLoaded(true)}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground" />
              </div>
            )}

            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-4 border-card" />
          </div>

          {/* Edit Button (shown on hover) */}
          <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isDragging}
            />
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg hover:bg-primary/90">
              {currentImage ? 'Change' : 'Add Photo'}
            </div>
          </label>

          {/* Remove Button (shown if image exists) */}
          {currentImage && (
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive/90 shadow-lg"
              title="Remove photo"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Instructions Toast (shows on first visit) */}
      {mounted && !showImage && typeof window !== 'undefined' && !localStorage.getItem('draggableImageHintShown') && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-card border border-primary text-foreground px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-4">
          <p className="text-sm">Drag this image anywhere on the screen! 🖱️</p>
          <button
            onClick={() => localStorage.setItem('draggableImageHintShown', 'true')}
            className="mt-2 w-full bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium hover:bg-primary/90"
          >
            Got it!
          </button>
        </div>
      )}
    </>
  );
}
