'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '../../@/lib/utils';

interface FeaturedImageProps {
  className?: string;
  alt: string;
  src?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

const FeaturedImage: React.FC<FeaturedImageProps> = ({
  className,
  alt,
  src = '',
  width = 960,
  height = 400,
  priority = false,
  loading = 'lazy',
}) => {
  if (!src) return null;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg mb-6',
        'aspect-[16/9] bg-gray-100 dark:bg-gray-800',
        className
      )}
    >
      <Image
        className={cn(
          'object-cover transition-all hover:scale-105 duration-300',
          'rounded-lg border border-gray-200 dark:border-gray-700'
        )}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        loading={loading}
        quality={90}
      />
    </div>
  );
};

export default FeaturedImage;
