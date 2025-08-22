
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Users } from 'lucide-react';
import { MenuItem } from '@/store/types';

interface MenuInfoProps {
  item: MenuItem;
  averageRating: number;
  reviewCount: number;
}

const MenuInfo: React.FC<MenuInfoProps> = ({ item, averageRating, reviewCount }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {item.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            {item.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {item.price.toFixed(2)}€
          </div>
          {averageRating > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {item.preparationTime || 15} min
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          <Users className="w-3 h-3 mr-1" />
          1 personne
        </Badge>
        {item.dietary?.includes('spicy') && (
          <Badge variant="destructive">🌶️ Épicé</Badge>
        )}
        {item.dietary?.includes('vegetarian') && (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            🌱 Végétarien
          </Badge>
        )}
      </div>
    </div>
  );
};

export default MenuInfo;
