
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setIsZoomed(false);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setIsZoomed(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      {images.length > 0 && (
        <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
          <OptimizedImage
            src={images[0]}
            alt={`${title} - Photo principale`}
            className="w-full h-80 object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index + 1}
              className="relative group cursor-pointer"
              onClick={() => openLightbox(index + 1)}
            >
              <OptimizedImage
                src={image}
                alt={`${title} - Photo ${index + 2}`}
                className="w-full h-20 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-md flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 5 && (
        <Button
          variant="outline"
          onClick={() => openLightbox(5)}
          className="w-full"
        >
          Voir toutes les photos ({images.length})
        </Button>
      )}

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent 
          className="max-w-4xl w-full h-full max-h-screen p-0 bg-black"
          onKeyDown={handleKeyDown}
        >
          {selectedIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation Buttons */}
              {selectedIndex > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
              )}

              {selectedIndex < images.length - 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              )}

              {/* Zoom Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <ZoomIn className="w-6 h-6" />
              </Button>

              {/* Image */}
              <div className={`transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
                <OptimizedImage
                  src={images[selectedIndex]}
                  alt={`${title} - Photo ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 z-10 text-white bg-black/50 px-3 py-1 rounded">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoGallery;
