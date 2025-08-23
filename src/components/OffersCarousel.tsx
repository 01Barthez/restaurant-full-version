
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { offers } from '@/data/offers.data';
import { OffersCarouselProps } from '@/types/global';

const OffersCarousel: React.FC<OffersCarouselProps> = ({ onOfferSelect }) => {
  const navigate = useNavigate();

  const handleClick = (offer: any) => {
    // Navigate to dedicated special offer page
    navigate(`/menu-special/${offer.id}`);
    // Keep compatibility with parent callbacks
    onOfferSelect?.(offer);
  };

  return (
    <section className="py-16 px-4 bg-restaurant-cream/20 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="title text-restaurant-dark dark:text-white mb-4">
            Offres Spéciales & Packs
          </h2>
          <p className="para text-gray-600 dark:text-gray-300 text-lg">
            Profitez de nos offres exceptionnelles et économisez sur vos commandes
          </p>
        </div>

        {/* Infinite Scroll Container with edge blur */}
        <div className="relative overflow-hidden group">
          {/* Edge blur overlays */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-restaurant-cream/90 via-restaurant-cream/40 to-transparent dark:from-gray-900/90 dark:via-gray-900/40 dark:to-transparent z-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-restaurant-cream/90 via-restaurant-cream/40 to-transparent dark:from-gray-900/90 dark:via-gray-900/40 dark:to-transparent z-10"
          />

          {/* Marquee track */}
          <div className="flex animate-marquee space-x-6 will-change-transform [animation-duration:36s] group-hover:[animation-play-state:paused]">
            {/* First Set */}
            {offers.map((offer, index) => {
              const IconComponent = offer.icon;
              return (
                <Card 
                  key={`first-${offer.id}`}
                  className="flex-shrink-0 w-72 sm:w-80 hover-scale cursor-pointer group/card dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 rounded-2xl"
                  onClick={() => handleClick(offer)}
                >
                  <CardContent className="p-6 relative">
                    {/* Badge */}
                    <div className={`absolute top-4 right-4 ${offer.color} text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm`}>
                      {offer.badge}
                    </div>
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 bg-restaurant-orange text-white text-sm font-bold px-2 py-1 rounded shadow-sm">
                      -{offer.discount}
                    </div>

                    <div className="text-center">
                      <div className={`w-16 h-16 ${offer.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/card:scale-110 transition-transform shadow-md`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-bold text-lg text-restaurant-dark dark:text-white mb-2">
                        {offer.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {offer.description}
                      </p>
                      
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <span className="text-gray-400 line-through text-sm">
                          {offer.originalPrice.toFixed(2)}€
                        </span>
                        <span className="text-2xl font-bold text-restaurant-orange">
                          {offer.discountPrice.toFixed(2)}€
                        </span>
                      </div>
                      
                      <Button className="w-full bg-restaurant-gradient text-white hover:opacity-90">
                        Commander Maintenant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Second Set for Infinite Effect */}
            {offers.map((offer, index) => {
              const IconComponent = offer.icon;
              return (
                <Card 
                  key={`second-${offer.id}`}
                  className="flex-shrink-0 w-72 sm:w-80 hover-scale cursor-pointer group/card dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 rounded-2xl"
                  onClick={() => handleClick(offer)}
                >
                  <CardContent className="p-6 relative">
                    {/* Badge */}
                    <div className={`absolute top-4 right-4 ${offer.color} text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm`}>
                      {offer.badge}
                    </div>
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 bg-restaurant-orange text-white text-sm font-bold px-2 py-1 rounded shadow-sm">
                      -{offer.discount}
                    </div>

                    <div className="text-center">
                      <div className={`w-16 h-16 ${offer.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/card:scale-110 transition-transform shadow-md`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-bold text-lg text-restaurant-dark dark:text-white mb-2">
                        {offer.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {offer.description}
                      </p>
                      
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <span className="text-gray-400 line-through text-sm">
                          {offer.originalPrice.toFixed(2)}€
                        </span>
                        <span className="text-2xl font-bold text-restaurant-orange">
                          {offer.discountPrice.toFixed(2)}€
                        </span>
                      </div>
                      
                      <Button className="w-full bg-restaurant-gradient text-white hover:opacity-90">
                        Commander Maintenant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersCarousel;
