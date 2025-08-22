
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ComponentErrorBoundary from '@/components/utils/errorBoundaries/ComponentErrorBoundary';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  skeletonClassName,
  priority = false,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.svg'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setCurrentSrc(fallbackSrc);
    onError?.();
  };

  return (
    <ComponentErrorBoundary componentName="LazyImage">
      <div ref={imgRef} className="relative">
        {isLoading && (
          <Skeleton 
            className={cn(
              'absolute inset-0 animate-pulse',
              skeletonClassName
            )} 
          />
        )}
        
        {isInView && (
          <img
            src={currentSrc}
            alt={alt}
            className={cn(
              'transition-all duration-500',
              isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100',
              hasError && 'filter grayscale',
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        )}
        
        {hasError && currentSrc === fallbackSrc && (
          <div className={cn(
            'bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm',
            className
          )}>
            Image non disponible
          </div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default LazyImage;
