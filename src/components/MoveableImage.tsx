'use client';

import { useState, useRef, MouseEvent } from 'react';
import { Move, GripVertical } from 'lucide-react';

interface MoveableImageProps {
  src: string;
  alt: string;
  size?: number;
  initialX?: number;
  initialY?: number;
}

export default function MoveableImage({
  src,
  alt,
  size = 200,
  initialX = 20,
  initialY = 20,
}: MoveableImageProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
      const newX = e.clientX - size / 2;
      const newY = e.clientY - size / 2;

      // Keep image within viewport bounds
      const maxX = window.innerWidth - size - 20;
      const maxY = window.innerHeight - size - 20;

      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(10, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newX = touch.clientX - size / 2;
      const newY = touch.clientY - size / 2;

      // Keep image within viewport bounds
      const maxX = window.innerWidth - size - 20;
      const maxY = window.innerHeight - size - 20;

      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(10, Math.min(newY, maxY)),
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={dragRef}
      className="fixed z-50 cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full rounded-full overflow-hidden
          shadow-2xl transition-all duration-200
          ${isDragging ? 'scale-105 shadow-primary/50 ring-2 ring-primary' : ''}
          ${isHovered ? 'shadow-xl ring-1 ring-primary/50' : ''}
        `}
      >
        {/* Profile Image */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Drag Handle Indicator */}
        <div
          className={`
            absolute bottom-2 right-2 bg-primary/90 backdrop-blur-sm
            rounded-full p-1.5 text-primary-foreground
            transition-opacity duration-200
            ${isHovered || isDragging ? 'opacity-100' : 'opacity-60'}
          `}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Move Icon Overlay (shows on hover) */}
        <div
          className={`
            absolute inset-0 bg-black/30 flex items-center justify-center
            transition-opacity duration-200 pointer-events-none
            ${isDragging ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <Move className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}
