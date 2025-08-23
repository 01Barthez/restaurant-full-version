import { Restaurant } from "@/data/restaurants.data";


// Interface pour les propriétés de style de la carte
export interface MapContainerStyle extends React.CSSProperties {
  width: string;
  height: string;
  position: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static';
  zIndex: number;
  filter?: string;
  transition?: string;
}

// Style personnalisé pour la carte
export const mapContainerStyle: MapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px', // Hauteur minimale pour mobile
  zIndex: 0,
  position: 'relative',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

export type Position = [number, number];

// Interface pour les propriétés du composant
export interface MarkerType {
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

export interface CircleType {
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

export interface InteractiveMapProps {
  restaurants: Restaurant[];
  selectedRestaurantId?: string;
  onMarkerClick?: (restaurant: Restaurant) => void;
  className?: string;
  height?: string | number;
}

