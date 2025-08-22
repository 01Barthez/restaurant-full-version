
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { MenuItem } from '@/store/types';

interface MenuActionsProps {
  item: MenuItem;
  onAddToCart: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}

const MenuActions: React.FC<MenuActionsProps> = ({
  item,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  onShare
}) => {
  return (
    <div className="flex space-x-3">
      <Button
        onClick={onAddToCart}
        className="flex-1 bg-orange-500 hover:bg-orange-600"
        disabled={!item.available}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {item.available ? 'Ajouter au panier' : 'Non disponible'}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleFavorite}
        className={isFavorite ? 'text-red-500 border-red-500' : ''}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MenuActions;
