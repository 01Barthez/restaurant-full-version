import React from 'react';
import { Restaurant } from '@/data/restaurants.data';

interface MarkerProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onClick: (restaurant: Restaurant) => void;
}

export const Marker: React.FC<MarkerProps> = ({ restaurant, isSelected, onClick }) => {
  const lastWord = restaurant.name.split(' ').pop() || '';
  const initial = lastWord[0] || 'R';
  
  return (
    <div 
      className="relative cursor-pointer"
      onClick={() => onClick(restaurant)}
    >
      <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 ${isSelected ? 'border-red-500' : 'border-orange-500'}`}>
        <span className="text-xs font-bold">{initial}</span>
      </div>
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </div>
  );
};

export const MarkerPopup: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
  <div className="p-3 max-w-xs bg-white dark:bg-gray-800 rounded-lg">
    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{restaurant.name}</h3>
    <div className="space-y-2 text-sm">
      <p className="text-gray-700 dark:text-gray-300">📍 {restaurant.address}</p>
      {restaurant.phone && (
        <p className="text-gray-700 dark:text-gray-300">
          📞 <a href={`tel:${restaurant.phone.replace(/\s+/g, '')}`} className="text-blue-600 dark:text-blue-400">
            {restaurant.phone}
          </a>
        </p>
      )}
      {restaurant.hours && (
        <p className="text-gray-700 dark:text-gray-300">⏰ {restaurant.hours}</p>
      )}
      {restaurant.website && (
        <a 
          href={restaurant.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          🌐 Visiter le site
        </a>
      )}
    </div>
  </div>
);
