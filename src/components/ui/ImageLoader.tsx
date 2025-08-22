
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className,
  skeletonClassName,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    <div className="relative">
      {isLoading && (
        <Skeleton className={cn('absolute inset-0', skeletonClassName)} />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default ImageLoader;
