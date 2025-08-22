
import React from 'react';
import { Clock, Star } from 'lucide-react';
import { MenuItem } from '@/types/restaurant';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ImageCarousel from './ui/ImageCarousel';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  // Use the gallery array if available, fallback to single image
  const images = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];

  return (
    <Card className="overflow-hidden hover-scale cursor-pointer group animate-fade-in" onClick={() => onSelect(item)}>
      <div className="relative">
        <div className="h-48">
          <ImageCarousel 
            images={images} 
            alt={item.name}
            autoSlide={true}
            interval={3000}
          />
        </div>
        {item.featured && (
          <Badge className="absolute top-2 left-2 bg-restaurant-gold text-restaurant-dark z-10">
            <Star className="w-3 h-3 mr-1" />
            Vedette
          </Badge>
        )}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-white/90 text-restaurant-dark">
            {item.price.toLocaleString()} FCFA
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-restaurant-dark line-clamp-1">{item.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{item.preparationTime} min</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
        </div>
        
        <Button 
          className="w-full bg-restaurant-gradient hover:opacity-90 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
        >
          Commander
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
