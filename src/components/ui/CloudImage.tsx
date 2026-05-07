'use client'

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface CloudImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackText?: string;
}

export default function CloudImage({ src, alt, className, fallbackText = 'Image unavailable', ...props }: CloudImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // If no source is provided or an error occurred, show the fallback UI
  if (!src || error) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-surface-card border border-border-primary w-full h-full min-h-[200px] text-text-secondary opacity-70", className)}>
        <ImageOff className="h-8 w-8 mb-2 opacity-50" />
        <span className="text-[10px] uppercase tracking-widest font-bold">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-surface-card animate-pulse z-0" />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "object-cover transition-opacity duration-500",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
