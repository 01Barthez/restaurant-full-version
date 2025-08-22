
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoSlide?: boolean;
  interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt, 
  autoSlide = true, 
  interval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!autoSlide || isHovered || isInteracting || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoSlide, isHovered, isInteracting, images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetTransforms = () => {
    setRotation(0);
    setZoom(1);
    setIsInteracting(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isInteracting) {
      resetTransforms();
    }
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div 
        className="relative w-full h-64 lg:h-96 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            style={{
              transform: `rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && !isInteracting && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Interactive Controls */}
        {isHovered && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={() => {
                handleRotate();
                setIsInteracting(true);
              }}
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={() => {
                handleZoomIn();
                setIsInteracting(true);
              }}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={() => {
                handleZoomOut();
                setIsInteracting(true);
              }}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Reset Button */}
        {isInteracting && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
            onClick={resetTransforms}
          >
            Reset
          </Button>
        )}

        {/* Auto-slide progress indicator */}
        {autoSlide && !isHovered && !isInteracting && images.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <div 
              className="h-full bg-restaurant-orange transition-all duration-100 ease-linear"
              style={{
                width: `${((currentIndex + 1) / images.length) * 100}%`
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex 
                  ? 'border-restaurant-orange scale-110' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-restaurant-orange/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator for Mobile */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-1 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-restaurant-orange scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-restaurant-orange/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
