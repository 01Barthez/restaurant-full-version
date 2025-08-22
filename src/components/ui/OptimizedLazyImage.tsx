import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Types pour les sources d'images supportées
type ImageSource = 'unsplash' | 'cloudinary' | 'local' | 'other';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  placeholder?: string;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  blurDataURL?: string;
  darkModeSrc?: string;
}

const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({
  src: originalSrc,
  alt,
  className,
  imgClassName,
  placeholder: customPlaceholder,
  quality = 75,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  fetchPriority = priority ? 'high' : 'auto',
  onLoad,
  onError,
  retryCount = 2,
  retryDelay = 1000,
  objectFit = 'cover',
  objectPosition = 'center',
  blurDataURL,
  darkModeSrc,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [inView, setInView] = useState(priority);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Détecter le mode sommet
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    setIsDarkMode(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Déterminer la source à utiliser en fonction du mode sombre
  const src = React.useMemo(() => {
    return isDarkMode && darkModeSrc ? darkModeSrc : originalSrc;
  }, [isDarkMode, darkModeSrc, originalSrc]);

  // Déterminer le type de source d'image
  const imageSource = React.useMemo<ImageSource>(() => {
    if (src.includes('unsplash.com')) return 'unsplash';
    if (src.includes('res.cloudinary.com')) return 'cloudinary';
    if (src.startsWith('/') || src.startsWith('http://localhost') || src.startsWith('./')) return 'local';
    return 'other';
  }, [src]);

  // Générer l'URL optimisée en fonction du fournisseur d'images
  const getOptimizedSrc = useCallback((imgSrc: string, width?: number, format = 'webp') => {
    if (!imgSrc) return '';

    const url = new URL(imgSrc, window.location.origin);

    switch (imageSource) {
      case 'unsplash':
        url.searchParams.set('w', width?.toString() || '1200');
        url.searchParams.set('q', quality.toString());
        url.searchParams.set('auto', 'format');
        url.searchParams.set('fit', 'crop');
        if (format === 'webp') url.searchParams.set('fm', 'webp');
        break;

      case 'cloudinary':
        const pathParts = url.pathname.split('/');
        const uploadIndex = pathParts.findIndex(part => part === 'upload');

        if (uploadIndex !== -1) {
          const transformations = [
            'f_auto',
            format === 'webp' ? 'f_webp' : '',
            `q_${quality}`,
            width ? `w_${width}` : '',
            'c_limit',
          ].filter(Boolean).join(',');

          pathParts.splice(uploadIndex + 1, 0, transformations);
          url.pathname = pathParts.join('/');
        }
        break;

      case 'local':
        // Pour les images locales, on pourrait utiliser un loader d'image ici
        break;
    }

    return url.toString();
  }, [imageSource, quality]);

  // Gestion du chargement réussi
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  }, [onLoad]);

  // Gestion des erreurs avec réessai
  const handleError = useCallback((error: any) => {
    if (errorCount < retryCount) {
      setErrorCount(prev => prev + 1);
      retryTimeoutRef.current = setTimeout(() => {
        // Forcer le rechargement de l'image
        if (imgRef.current) {
          const src = imgRef.current.src;
          imgRef.current.src = '';
          setTimeout(() => {
            if (imgRef.current) imgRef.current.src = src;
          }, 50);
        }
      }, retryDelay * (errorCount + 1));
    } else {
      onError?.(new Error(`Failed to load image after ${retryCount} attempts`));
    }
  }, [errorCount, retryCount, retryDelay, onError]);

  // Observer l'intersection pour le lazy loading
  useEffect(() => {
    if (priority || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setIsIntersecting(true);
          observer.disconnect();
          observerRef.current = null;
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
        root: null
      }
    );

    observerRef.current = observer;

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [priority, inView]);

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Déterminer le placeholder à utiliser
  const placeholder = React.useMemo(() => {
    if (blurDataURL) return blurDataURL;
    if (customPlaceholder) return customPlaceholder;

    // Générer un placeholder SVG avec une couleur adaptée au thème
    if (isDarkMode) {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%231f2937'/%3E%3C/svg%3E`;
    }
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%23fafafa'/%3E%3C/svg%3E`;
  }, [blurDataURL, customPlaceholder, isDarkMode]);

  // Styles pour le conteneur
  const containerClasses = cn(
    'relative overflow-hidden',
    'bg-gray-100 dark:bg-gray-900', // Fond plus sombre en mode sombre
    'transition-all duration-300',
    className
  );

  // Styles pour l'image
  const imageClasses = cn(
    'w-full h-full transition-opacity duration-500',
    `object-${objectFit}`,
    objectPosition && `object-${objectPosition.replace(' ', '-')}`,
    isLoaded ? 'opacity-100' : 'opacity-0',
    imgClassName
  );

  // Générer les sources pour les différentes tailles d'écran
  const generateSrcSet = useCallback((format: 'webp' | 'jpg' | 'png' = 'webp') => {
    if (!inView) return '';

    const widths = [320, 480, 768, 1024, 1280, 1536];
    return widths
      .map(width => `${getOptimizedSrc(src, width, format)} ${width}w`)
      .join(', ');
  }, [getOptimizedSrc, inView, src]);

  // Si on n'est pas en vue et pas prioritaire, on ne charge rien
  if (!inView && !priority) {
    return (
      <div className={containerClasses} ref={imgRef}>
        <img
          src={placeholder}
          alt=""
          className="w-full h-full object-cover opacity-100"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={containerClasses} ref={imgRef}>
      {/* Placeholder */}
      <img
        src={placeholder}
        alt=""
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-300',
          'object-cover',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      {/* Image principale avec support WebP */}
      <picture>
        {/* WebP pour les navigateurs compatibles */}
        {['unsplash', 'cloudinary'].includes(imageSource) && (
          <source
            srcSet={generateSrcSet('webp')}
            sizes={sizes}
            type="image/webp"
          />
        )}

        {/* Fallback pour les navigateurs qui ne supportent pas WebP */}
        <source
          srcSet={generateSrcSet('jpg')}
          sizes={sizes}
          type="image/jpeg"
        />

        {/* Image de fallback */}
        <img
          ref={imgRef}
          src={getOptimizedSrc(src, undefined, 'jpg')}
          srcSet={generateSrcSet('jpg')}
          alt={alt}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={fetchPriority}
          decoding="async"
          sizes={sizes}
          style={{
            objectFit,
            objectPosition
          }}
        />
      </picture>

      {/* Indicateur de chargement */}
      {!isLoaded && inView && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Message d'erreur */}
      {errorCount > retryCount && (
        <div className={cn(
          'absolute inset-0 flex flex-col items-center justify-center p-4 text-center',
          'bg-red-50/90 dark:bg-gray-800/95', // Fond plus couvrant en mode sombre
          'backdrop-blur-sm', // Léger flou pour le mode sombre
          'border border-red-200 dark:border-red-900/50', // Bordure plus subtile en mode sombre
          'rounded-md m-1' // Léger arrondi et marge
        )}>
          <span className="text-red-600 dark:text-red-300 text-sm font-medium">
            Impossible de charger l'image
          </span>
          <button
            onClick={() => {
              setErrorCount(0);
              setInView(true);
            }}
            className={cn(
              'mt-2 px-3 py-1 text-xs rounded',
              'text-red-600 dark:text-red-300',
              'hover:bg-red-100 dark:hover:bg-red-900/30',
              'transition-colors duration-200',
              'border border-red-200 dark:border-red-800',
              'focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700',
              'focus:ring-offset-2 dark:focus:ring-offset-gray-800'
            )}
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedLazyImage);


// usage

/**
 * 
  <OptimizedLazyImage
  src="/image.jpg"
  alt="Description de l'image"
  className="ma-classe"
  priority={false}
  quality={80}
  sizes="(max-width: 768px) 100vw, 50vw"
  darkModeSrc="/image-dark.jpg"
  blurDataURL="data:image/jpeg;base64,..."
/>
 * **/ 