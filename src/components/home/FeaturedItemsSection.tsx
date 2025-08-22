import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Star, Clock } from 'lucide-react';
import { menuItems } from '@/data/mockData';

interface FeaturedItemsSectionProps {
  onMenuClick: () => void;
  onItemSelect: (itemId: string) => void;
}

const FeaturedItemsSection: React.FC<FeaturedItemsSectionProps> = ({ onMenuClick, onItemSelect }) => {
  const featuredItems = menuItems.filter(item => item.featured).slice(0, 6);

  return (
    <section className="py-16 px-4 bg-restaurant-cream/30 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-restaurant-orange/10 text-restaurant-orange px-3 py-1 mb-4">
            Nos Spécialités
          </Badge>
          <h2 className="title text-restaurant-dark dark:text-white mb-4">
            Plats d'Exception
          </h2>
          <p className="para text-gray-600 dark:text-gray-300  mx-auto">
            Découvrez nos créations culinaires les plus appréciées, préparées avec passion par nos chefs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 mx-10 md:mx-0">
          {featuredItems.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden hover-scale cursor-pointer group animate-fade-in border-2 border-transparent hover:border-restaurant-orange/20 dark:bg-gray-800 dark:border-gray-700"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onItemSelect(item.id)}
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 left-2 bg-restaurant-gold text-restaurant-dark px-2 py-1 rounded text-sm font-medium">
                  <Star className="w-3 h-3 inline mr-1" />
                  Vedette
                </div>
                <div className="absolute top-2 right-2 bg-white/90 text-restaurant-dark px-2 py-1 rounded-full font-bold text-xs lg:text-lg">
                  {item.price.toLocaleString()} FCFA
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-restaurant-dark dark:text-white mb-2 group-hover:text-restaurant-orange transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.preparationTime} min
                  </div>
                  <Badge variant="outline" className="text-restaurant-orange border-restaurant-orange">
                    {item.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={onMenuClick}
            className="bg-restaurant-gradient text-white hover:opacity-90 px-8 py-4 text-lg"
          >
            <Utensils className="w-5 h-5 mr-2" />
            Voir Toute Notre Carte
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItemsSection;
