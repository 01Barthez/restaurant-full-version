
import { RESTAURANT_COORDINATES, LOCATION_RADIUS_METERS } from '@/store/constants';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface LocationValidationResult {
  isValid: boolean;
  distance?: number;
  error?: string;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function getUserLocation(): Promise<LocationData> {
  try {
    // Try IPStack first
    const response = await fetch('http://api.ipstack.com/check?access_key=free&format=1');
    
    if (!response.ok) {
      throw new Error('IPStack API error');
    }
    
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name
      };
    }
    
    throw new Error('Invalid location data from IPStack');
  } catch (error) {
    console.warn('IPStack failed, trying browser geolocation:', error);
    
    // Fallback to browser geolocation
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}

export function validateUserLocation(userLocation: LocationData): LocationValidationResult {
  try {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      RESTAURANT_COORDINATES.latitude,
      RESTAURANT_COORDINATES.longitude
    );
    
    return {
      isValid: distance <= LOCATION_RADIUS_METERS,
      distance: Math.round(distance)
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Error validating location'
    };
  }
}

export async function checkUserLocationForOrdering(): Promise<LocationValidationResult> {
  try {
    const userLocation = await getUserLocation();
    return validateUserLocation(userLocation);
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown location error'
    };
  }
}
