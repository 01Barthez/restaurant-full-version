import { calculateDistance } from "@/components/functions/calculateDistance";
import { getUserLocation } from "@/components/functions/getUserLocation";
import { LOCATION_RADIUS_METERS, RESTAURANT_COORDINATES } from "@/constants/global";
import { LocationData, LocationValidationResult } from "@/types/global";


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
