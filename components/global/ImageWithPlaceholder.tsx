'use client';

import { useState } from 'react';
import Image from 'next/image';

type ImageWithPlaceholderProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  border?: string;
};

export default function ImageWithPlaceholder({
  src,
  alt,
  width,
  height,
  className = '',
  border = undefined,
}: ImageWithPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      style={{ width, height }}
      className="relative flex items-center justify-center overflow-hidden rounded-lg"
    >
      {!imageLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:300%_100%]" />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setImageLoaded(true)}
        placeholder="empty"
        className={`${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
        style={{ border: border }}
      />
    </div>
  );
}
