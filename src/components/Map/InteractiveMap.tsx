import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { AdvancedMap, MapRefType } from "@/components/ui/interactive-map";
import { Restaurant } from '@/data/restaurants.data';
import { InteractiveMapProps } from '@/types/map.types';
import useTheme from '@/hooks/useTheme';
import useGeolocation from '@/hooks/useGeolocation';
import { useMapMarkers, useMapCenter } from '@/hooks/useMapMarkers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Locate } from 'lucide-react';


const InteractiveMap: React.FC<InteractiveMapProps> = ({
  restaurants,
  selectedRestaurantId,
  onMarkerClick,
  className = '',
  height = 600,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { position: userLocation, locateUser, isLoading: isLocating } = useGeolocation();
  
  // Utilisation des hooks personnalisés
  const markers = useMapMarkers(restaurants, selectedRestaurantId);
  const mapCenter = useMapCenter(restaurants, selectedRestaurantId);
  const mapRef = useRef<MapRefType>(null);

  // Évite le rendu côté serveur pour le thème
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMarkerClick = useCallback((marker: { id: string }) => {
    const restaurant = restaurants.find(r => r.id === marker.id);
    if (restaurant && onMarkerClick) {
      onMarkerClick(restaurant);
    }
  }, [restaurants, onMarkerClick]);

  // Gestion de la recherche
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
    // Ici, vous pourriez ajouter la logique de recherche
  }, [searchQuery]);

  // Gestion du clic sur la carte
  const handleMapClick = useCallback((latlng: { lat: number; lng: number }) => {
    console.log('Carte cliquée à:', latlng);
  }, []);

  // Créer des zones de service autour de chaque restaurant (optionnel)
  const circles = useMemo(() => {
    return restaurants.map(restaurant => ({
      center: [restaurant.coordinates.lat, restaurant.coordinates.lng] as [number, number],
      radius: 1000, // 1km de rayon par défaut
      pathOptions: {
        color: selectedRestaurantId === restaurant.id ? '#ef4444' : '#f97316',
        weight: 1,
        fillOpacity: 0.1,
        dashArray: '5, 5',
        fillColor: 'rgba(255, 165, 0, 0.1)'
      },
      popup: `Zone de service de ${restaurant.name}`
    }));
  }, [restaurants, selectedRestaurantId]);

  // Configuration de la carte
  const mapConfig = {
    center: mapCenter,
    zoom: 13,
    markers,
    circles,
    onMarkerClick: handleMarkerClick,
    onMapClick: handleMapClick,
    enableControls: true,
    enableSearch: true,
    style: {
      width: '100%',
      height: '100%',
      minHeight: '400px',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },
    mapLayers: {
      openstreetmap: true,
      satellite: false,
      traffic: false
    },
    className: theme === 'dark' ? 'dark' : 'light'
  };

  // Effet pour gérer les changements de thème
  useEffect(() => {
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      if (theme === 'dark') {
        mapElement.classList.add('dark-mode');
      } else {
        mapElement.classList.remove('dark-mode');
      }
    }
  }, [theme]);

  if (!mounted) {
    return null;
  }

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    position: 'relative' as const,
    zIndex: 0
  };

  return (
    <div className={`w-full relative ${className}`} style={containerStyle}>
      {/* Barre de recherche */}
      <div className="absolute top-4 left-4 z-10 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un restaurant..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={locateUser}
            disabled={isLocating}
            title="Me localiser"
          >
            <Locate className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Carte */}
      <div className="h-full w-full">
        <AdvancedMap
          ref={mapRef}
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          markers={mapConfig.markers}
          circles={mapConfig.circles}
          onMarkerClick={mapConfig.onMarkerClick}
          onMapClick={mapConfig.onMapClick}
          enableControls={mapConfig.enableControls}
          enableSearch={mapConfig.enableSearch}
          style={mapConfig.style}
          mapLayers={mapConfig.mapLayers}
          className={mapConfig.className}
        />
      </div>
    </div>
  );
};

export default InteractiveMap;