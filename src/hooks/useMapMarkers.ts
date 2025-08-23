import { useMemo } from 'react';
import { Restaurant } from '@/data/restaurants.data';
import { MarkerType } from '@/types/map.types';

export const useMapMarkers = (
  restaurants: Restaurant[], 
  selectedRestaurantId?: string | null
): MarkerType[] => {
  return useMemo(() => {
    return restaurants.map(restaurant => {
      const isSelected = selectedRestaurantId === restaurant.id;
      const lastWord = restaurant.name.split(' ').pop() || '';
      const initial = lastWord[0] || 'R';
      
      return {
        id: restaurant.id,
        position: [restaurant.coordinates.lat, restaurant.coordinates.lng] as [number, number],
        color: isSelected ? 'red' : 'orange',
        size: isSelected ? 'large' : 'medium',
        popup: {
          title: '',
          content: '',
          image: restaurant.images?.[0]
        },
        customIcon: {
          html: `
            <div class="relative">
              <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 ${isSelected ? 'border-red-500' : 'border-orange-500'}">
                <span class="text-xs font-bold">${initial}</span>
              </div>
              ${isSelected ? 
                '<div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>' : 
                ''
              }
            </div>
          `
        }
      };
    });
  }, [restaurants, selectedRestaurantId]);
};

export const useMapCenter = (
  restaurants: Restaurant[], 
  selectedRestaurantId?: string | null
): [number, number] => {
  return useMemo(() => {
    if (selectedRestaurantId) {
      const selected = restaurants.find(r => r.id === selectedRestaurantId);
      if (selected) {
        return [selected.coordinates.lat, selected.coordinates.lng];
      }
    }
    
    if (restaurants.length > 0) {
      const avgLat = restaurants.reduce((sum, r) => sum + r.coordinates.lat, 0) / restaurants.length;
      const avgLng = restaurants.reduce((sum, r) => sum + r.coordinates.lng, 0) / restaurants.length;
      return [avgLat, avgLng];
    }
    
    return [3.848, 11.5021]; // Default to Yaoundé
  }, [restaurants, selectedRestaurantId]);
};
