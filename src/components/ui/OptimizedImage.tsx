
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  skeletonClassName,
  priority = false,
  onLoad,
  onError,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP and fallback URLs
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'jpeg' = 'webp') => {
    if (originalSrc.includes('unsplash.com')) {
      const params = new URLSearchParams({
        auto: 'format',
        fit: 'crop',
        w: '800',
        q: quality.toString(),
        fm: format
      });
      return `${originalSrc}&${params.toString()}`;
    }
    return originalSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={cn(
        'bg-gray-200 dark:bg-gray-700 flex items-center justify-center',
        className
      )}>
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={imgRef}>
      {isLoading && (
        <Skeleton className={cn(
          'absolute inset-0 animate-shimmer bg-shimmer bg-[length:200%_100%]',
          skeletonClassName
        )} />
      )}
      
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          <source 
            srcSet={getOptimizedSrc(src, 'webp')} 
            type="image/webp" 
            sizes={sizes}
          />
          
          {/* Fallback JPEG source */}
          <source 
            srcSet={getOptimizedSrc(src, 'jpeg')} 
            type="image/jpeg" 
            sizes={sizes}
          />
          
          {/* Fallback img element */}
          <img
            src={getOptimizedSrc(src, 'jpeg')}
            alt={alt}
            className={cn(
              'transition-all duration-500',
              isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100',
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
