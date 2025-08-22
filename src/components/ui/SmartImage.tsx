
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cacheService } from '@/services/cacheService';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className,
  skeletonClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority
  });

  const shouldLoad = priority || inView;

  // Generate optimized URLs for different formats
  const generateOptimizedUrl = (originalSrc: string, format: 'webp' | 'avif' | 'jpeg' = 'webp') => {
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('fm', format);
      
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      
      return url.toString();
    }
    return originalSrc;
  };

  // Load image with caching
  const loadImage = async (url: string) => {
    try {
      // Check cache first
      const cachedBlob = await cacheService.getCachedImage(url);
      if (cachedBlob) {
        const cachedUrl = URL.createObjectURL(cachedBlob);
        setImageSrc(cachedUrl);
        setIsLoading(false);
        onLoad?.();
        return;
      }

      // Fetch image
      const response = await fetch(url);
      if (!response.ok) throw new Error('Image fetch failed');
      
      const blob = await response.blob();
      
      // Cache the image
      await cacheService.cacheImage(url, blob);
      
      // Create object URL and set
      const objectUrl = URL.createObjectURL(blob);
      setImageSrc(objectUrl);
      setIsLoading(false);
      onLoad?.();
      
      // Cleanup object URL after a delay
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
      
    } catch (error) {
      console.error('Error loading image:', error);
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  // Progressive image loading: try AVIF -> WebP -> JPEG
  const loadProgressiveImage = async () => {
    const formats = ['avif', 'webp', 'jpeg'] as const;
    
    for (const format of formats) {
      try {
        const url = generateOptimizedUrl(src, format);
        await loadImage(url);
        break; // Success, stop trying other formats
      } catch (error) {
        console.warn(`Failed to load ${format} format, trying next...`);
        if (format === 'jpeg') {
          // Last resort failed
          setHasError(true);
          setIsLoading(false);
          onError?.();
        }
      }
    }
  };

  useEffect(() => {
    if (shouldLoad && !imageSrc && !hasError) {
      if ('IntersectionObserver' in window) {
        loadProgressiveImage();
      } else {
        // Fallback for older browsers
        setImageSrc(generateOptimizedUrl(src, 'jpeg'));
      }
    }
  }, [shouldLoad, src, imageSrc, hasError]);

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        ref={inViewRef}
        className={cn(
          'bg-gray-200 dark:bg-gray-700 flex items-center justify-center',
          className
        )}
      >
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div ref={inViewRef} className="relative">
      {isLoading && (
        <Skeleton 
          className={cn(
            'absolute inset-0 animate-pulse',
            skeletonClassName
          )} 
        />
      )}
      
      {shouldLoad && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={cn(
            'transition-all duration-500',
            isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100',
            className
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default SmartImage;
