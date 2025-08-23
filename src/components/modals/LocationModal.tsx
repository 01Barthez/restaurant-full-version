
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, Navigation } from 'lucide-react';
import { LocationModalProps } from '@/types/global';

const LocationModal: React.FC<LocationModalProps> = ({ 
  isOpen, 
  onClose, 
  distance,
  onRetry 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center"
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <DialogTitle className="text-2xl font-bold text-restaurant-dark">
                  <AlertTriangle className="w-6 h-6 inline mr-2 text-orange-500" />
                  Commande non autorisée
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="text-center">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Pour passer commande, vous devez être présent dans notre restaurant.
                  </p>
                  
                  {distance && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-orange-800 font-medium">
                        Vous êtes actuellement à <Badge variant="secondary" className="mx-1">{distance}m</Badge> du restaurant
                      </p>
                      <p className="text-orange-600 text-sm mt-1">
                        Limite autorisée: 100m
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Navigation className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">Le Délice Moderne</span>
                    </div>
                    <p className="text-blue-600 text-sm">
                      123 Rue de la Gastronomie, 75001 Yaoundé
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={onRetry}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Vérifier ma position
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="border-gray-300"
                  >
                    Continuer à parcourir le menu
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Cette vérification garantit la fraîcheur de nos plats et la qualité du service.
                  </p>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LocationModal;
