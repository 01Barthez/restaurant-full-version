
import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MenuCardProps } from '@/types/global';
import OptimizedLazyImage from './ui/OptimizedLazyImage';

const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  return (
    <Card className="overflow-hidden hover-scale cursor-pointer group animate-fade-in" onClick={() => onSelect(item)}>
      <div className="relative">
        <OptimizedLazyImage
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
          quality={80}
          sizes="(max-width: 768px) 100vw, 50vw"
          darkModeSrc="/image-dark.jpg"
          blurDataURL="data:image/jpeg;base64,..."
        />
        {item.featured && (
          <Badge className="absolute top-2 left-2 bg-restaurant-gold text-restaurant-dark">
            <Star className="w-3 h-3 mr-1" />
            Vedette
          </Badge>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-restaurant-dark">
            {item.price.toFixed(2)}€
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
