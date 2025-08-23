import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const useGeolocation = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      toast({
        title: 'Erreur',
        description: "La géolocalisation n'est pas supportée par votre navigateur",
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    toast({
      title: 'Localisation en cours',
      description: 'Recherche de votre position...',
      duration: 5000,
    });

    navigator.geolocation.getCurrentPosition(
      (pos: Position) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setIsLoading(false);
        
        toast({
          title: 'Position trouvée',
          description: 'Votre position a été localisée avec succès',
          variant: 'default',
          duration: 3000,
        });
      },
      (error: GeolocationPositionError) => {
        console.error('Erreur de géolocalisation:', error);
        let errorMessage = 'Impossible de récupérer votre position';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "La géolocalisation a été refusée. Veuillez autoriser l'accès à votre position dans les paramètres de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Les informations de localisation ne sont pas disponibles.";
            break;
          case error.TIMEOUT:
            errorMessage = "Le délai de la requête de géolocalisation a expiré. Veuillez réessayer.";
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        
        toast({
          title: 'Erreur de localisation',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000
      }
    );
  }, [toast]);

  return {
    position,
    isLoading,
    error,
    locateUser,
  };
};

export default useGeolocation;
