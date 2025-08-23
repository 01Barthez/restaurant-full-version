import { LocationData } from "@/types/global";

// Calculate distance between two coordinates using Haversine formula
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