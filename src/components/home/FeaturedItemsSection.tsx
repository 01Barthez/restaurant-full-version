import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Star, Clock, ChevronRight, Heart } from 'lucide-react';
import { menuItems } from '@/data/menuItems.data';
import { toast } from '@/components/ui/use-toast';
import OptimizedLazyImage from '../ui/OptimizedLazyImage';

const FAVORITES_KEY = 'resto_favorites';

interface FeaturedItemsSectionProps {
  onMenuClick: () => void;
  onItemSelect: (id: string) => void;
}

const FeaturedItemsSection: React.FC<FeaturedItemsSectionProps> = ({ onMenuClick, onItemSelect }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const featuredItems = menuItems.filter(item => item.featured).slice(0, 4);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (itemId: string, itemName: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
        toast({
          title: 'Favori retiré',
          description: `${itemName} a été retiré de vos favoris`,
          variant: 'default',
        });
      } else {
        newFavorites.add(itemId);
        toast({
          title: 'Ajouté aux favoris',
          description: `${itemName} a été ajouté à vos favoris`,
          variant: 'default',
        });
      }
      return newFavorites;
    });
  };

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-white to-restaurant-cream/30 dark:from-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 lg:mb-16 max-w-3xl mx-auto">
          <h2 className="title text-restaurant-dark dark:text-white mb-4 bg-clip-text bg-gradient-to-r from-restaurant-dark to-restaurant-orange dark:from-white dark:to-restaurant-orange/80 text-transparent">
            Plats d'Exception
          </h2>
          <p className="para text-gray-600 dark:text-gray-300 leading-relaxed">
            Découvrez nos créations culinaires les plus appréciées, préparées avec passion par nos chefs étoilés
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8 px-2">
          {featuredItems.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border-2 border-orange-500/15 hover:border-orange-500/85 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => onItemSelect(item.id)}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 w-full">
                  <OptimizedLazyImage
                    src={item.image}
                    alt={item.name}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={false}
                    quality={80}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    darkModeSrc="/image-dark.jpg"
                    blurDataURL="data:image/jpeg;base64,..."
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge Top Left */}
                <Badge className="absolute border border-primary top-2 left-2 bg-white/80 text-restaurant-dark hover:bg-white px-3 py-1 rounded-full font-medium text-xs shadow-md">
                  <Star className="w-3.5 h-3.5 mr-1.5 text-restaurant-gold fill-current" />
                  Vedette
                </Badge>

                {/* Price */}
                <Badge className="absolute bottom-2 right-2 bg-primary/85 text-white/90 px-3 py-.5 rounded-full font-bold text-sm shadow-lg">
                  {item.price.toLocaleString()} FCFA
                </Badge>

                {/* Quick View Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    className="bg-primary text-white border hover:bg-primary/90 px-8 py-1 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemSelect(item.id);
                    }}
                  >
                    Voir le plat
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-restaurant-dark dark:text-white group-hover:text-restaurant-orange transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:bg-transparent ${favorites.has(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id, item.name);
                    }}
                    aria-label={favorites.has(item.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {favorites.has(item.id) ? (
                      <Heart className="w-5 h-5 fill-current" />
                    ) : (
                      <Heart className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4 line-clamp-2 min-h-[2.5rem]">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{item.preparationTime} min</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-3 py-1 border-restaurant-orange/30 text-restaurant-orange bg-restaurant-orange/5 hover:bg-restaurant-orange/10"
                  >
                    {item.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Button
            size="lg"
            onClick={onMenuClick}
            className="relative overflow-hidden group bg-gradient-to-r from-restaurant-orange to-restaurant-orange/90 text-white hover:from-restaurant-orange/90 hover:to-restaurant-orange/80 px-3 md:px-6 py-4 text-xs md:text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center">
              <Utensils className="w-5 h-5 mr-3" />
              Voir tout le menu
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          {favorites.size > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                const favoriteItem = featuredItems.find(item => favorites.has(item.id));
                if (favoriteItem) {
                  onItemSelect(favoriteItem.id);
                } else {
                  onMenuClick();
                }
              }}
              className="border-restaurant-orange/30 text-restaurant-orange hover:bg-restaurant-orange/10 hover:border-restaurant-orange/50 px-3 md:px-6 py-4 text-xs md:text-sm font-medium rounded-full transition-all duration-300"
            >
              <span className="relative z-10 flex items-center">
                <Heart className="w-5 h-5 mr-2 fill-current text-restaurant-orange" />
                Voir mes favoris ({favorites.size})
              </span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedItemsSection;
