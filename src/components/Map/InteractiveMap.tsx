import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { AdvancedMap } from "@/components/ui/interactive-map";
import { Restaurant } from '@/data/restaurants.data';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/use-toast';

// Interface pour les propriétés de style de la carte
interface MapContainerStyle extends React.CSSProperties {
  width: string;
  height: string;
  position: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static';
  zIndex: number;
  filter?: string;
  transition?: string;
}

// Style personnalisé pour la carte
const mapContainerStyle: MapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px', // Hauteur minimale pour mobile
  zIndex: 0,
  position: 'relative',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

type Position = [number, number];

// Interface pour les propriétés du composant
interface MarkerType {
  id: string;
  position: Position;
  color: string;
  size: 'small' | 'medium' | 'large';
  popup: {
    title: string;
    content: string;
    image?: string;
  };
  customIcon: {
    html: string;
  };
}

interface CircleType {
  id: string;
  center: Position;
  radius: number;
  style: {
    color: string;
    weight: number;
    fillOpacity: number;
    dashArray: string;
  };
  popup: string;
}

interface InteractiveMapProps {
  restaurants: Restaurant[];
  selectedRestaurantId?: string;
  onMarkerClick?: (restaurant: Restaurant) => void;
  className?: string;
  height?: string | number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  restaurants,
  selectedRestaurantId,
  onMarkerClick,
  className = '',
  height = '600px',
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Évite le rendu côté serveur pour le thème
  useEffect(() => {
    setMounted(true);
  }, []);
  // Convertir les restaurants en marqueurs pour la carte
  const markers = useMemo<MarkerType[]>(() => {
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
          content: `
            <div class="p-3 max-w-xs bg-white dark:bg-gray-800 rounded-lg">
              <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">${restaurant.name}</h3>
              <div class="space-y-2 text-sm">
                <p class="text-gray-700 dark:text-gray-300">📍 ${restaurant.address}</p>
                ${restaurant.phone ? `<p class="text-gray-700 dark:text-gray-300">📞 <a href="tel:${restaurant.phone.replace(/\s+/g, '')}" class="text-blue-600 dark:text-blue-400">${restaurant.phone}</a></p>` : ''}
                ${restaurant.hours ? `<p class="text-gray-700 dark:text-gray-300">⏰ ${restaurant.hours}</p>` : ''}
                ${restaurant.website ? `<a href="${restaurant.website}" target="_blank" class="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">🌐 Visiter le site</a>` : ''}
              </div>
            </div>
          `,
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

  // Calculer le centre de la carte en fonction des restaurants
  const mapCenter = useMemo((): [number, number] => {
    if (selectedRestaurantId) {
      const selected = restaurants.find(r => r.id === selectedRestaurantId);
      if (selected) {
        return [selected.coordinates.lat, selected.coordinates.lng];
      }
    }
    
    // Calculer le centre moyen si pas de restaurant sélectionné
    if (restaurants.length > 0) {
      const avgLat = restaurants.reduce((sum, r) => sum + r.coordinates.lat, 0) / restaurants.length;
      const avgLng = restaurants.reduce((sum, r) => sum + r.coordinates.lng, 0) / restaurants.length;
      return [avgLat, avgLng];
    }
    
    // Par défaut, centrer sur Yaoundé
    return [3.848, 11.5021];
  }, [restaurants, selectedRestaurantId]);

  const handleMarkerClick = useCallback((marker: { id: string }) => {
    const restaurant = restaurants.find(r => r.id === marker.id);
    if (restaurant && onMarkerClick) {
      onMarkerClick(restaurant);
    }
  }, [restaurants, onMarkerClick]);

  // Gestion de la géolocalisation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Localiser l'utilisateur
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: 'Erreur',
        description: 'La géolocalisation n\'est pas supportée par votre navigateur',
        variant: 'destructive',
      });
      return;
    }
    
    // Afficher un toast de chargement
    toast({
      title: 'Localisation en cours',
      description: 'Recherche de votre position...',
      duration: 5000,
    });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location: [number, number] = [latitude, longitude];
        setUserLocation(location);
        
        // Mettre à jour le centre de la carte via l'état
        // La carte se mettra à jour automatiquement grâce au mapCenter dans le useMemo
        
        // Afficher un nouveau toast de succès
        toast({
          title: 'Position trouvée',
          description: 'Votre position a été localisée avec succès',
          variant: 'default',
          duration: 3000,
        });
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        let errorMessage = 'Impossible de récupérer votre position';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'La géolocalisation a été refusée. Veuillez autoriser l\'accès à votre position dans les paramètres de votre navigateur.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Les informations de localisation ne sont pas disponibles.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Le délai de la requête de géolocalisation a expiré. Veuillez réessayer.';
            break;
        }
        
        // Afficher un toast d'erreur
        toast({
          title: 'Erreur de localisation',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Augmenter le timeout à 15 secondes
        maximumAge: 5 * 60 * 1000 // Mettre en cache la position pendant 5 minutes
      }
    );
  }, [toast]);
  
  // Recherche d'adresses
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();
      setSearchResults(results);
      
      if (results.length > 0) {
        const { lat, lon } = results[0];
        // Vous pourriez vouloir centrer la carte sur le premier résultat
        // mapRef.current?.flyTo([parseFloat(lat), parseFloat(lon)], 15);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  }, []);
  
  // Gestion du clic sur la carte
  const handleMapClick = useCallback((latlng: { lat: number; lng: number }) => {
    console.log('Carte cliquée à:', latlng);
  }, []);

  // Créer des zones de service autour de chaque restaurant (optionnel)
  const circles = useMemo<CircleType[]>(() => {
    return restaurants.map(restaurant => ({
      id: `service-${restaurant.id}`,
      center: [restaurant.coordinates.lat, restaurant.coordinates.lng] as [number, number],
      radius: 1000, // 1km de rayon
      style: { 
        color: selectedRestaurantId === restaurant.id ? '#ef4444' : '#f97316',
        weight: 1,
        fillOpacity: 0.1,
        dashArray: '5, 5'
      },
      popup: `Zone de service de ${restaurant.name}`
    }));
  }, [restaurants, selectedRestaurantId]);

  // Effet pour gérer les changements de thème
  useEffect(() => {
    // Réinitialiser le style de la carte lors du changement de thème
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      if (theme === 'dark') {
        mapElement.classList.add('dark-mode');
      } else {
        mapElement.classList.remove('dark-mode');
      }
    }
  }, [theme]);

  return (
    <div 
      className={`w-full relative ${className}`} 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        zIndex: 0
      }}
    >
      {/* Barre de recherche personnalisée */}
      <div className="absolute top-4 left-4 z-[1000] w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Rechercher une adresse..."
            className="flex-1 p-2 rounded-l border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <button
            onClick={locateUser}
            className="p-2 bg-amber-500 text-white rounded-r hover:bg-amber-600 transition-colors"
            title="Me localiser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Résultats de la recherche */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-b-lg shadow-lg border-t border-gray-200 dark:border-gray-700">
            {searchResults.slice(0, 5).map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  // Centrer la carte sur le résultat sélectionné
                  // mapRef.current?.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 15);
                  setSearchQuery(result.display_name);
                  setSearchResults([]);
                }}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {result.display_name.split(',').slice(0, 3).join(',')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Carte */}
      <div className="w-full h-full rounded-lg overflow-hidden relative">
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            mounted && theme === 'dark' 
              ? 'bg-gray-900' 
              : 'bg-gray-50'
          }`}
          style={{
            filter: mounted && theme === 'dark' 
              ? 'invert(100%) hue-rotate(180deg) brightness(95%)' 
              : 'none',
            transition: 'filter 0.3s ease-in-out',
          }}
        >
          <AdvancedMap
            center={mapCenter}
            zoom={selectedRestaurantId ? 15 : 12}
            markers={markers}
            circles={circles}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            enableClustering={restaurants.length > 5}
            enableSearch={false}
            enableControls={true}
            className={`w-full h-full ${className}`}
            style={{
              height: '100%',
              width: '100%',
              minHeight: '400px',
            }}
            mapLayers={{
              openstreetmap: true,
              satellite: false,
              traffic: false
            }}
          />
        </div>
      </div>
      
      {/* Légende */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">Légende</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Restaurant</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Sélectionné</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;