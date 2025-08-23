
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import EnhancedAuthModal from '@/components/modals/EnhancedAuthModal';
import LocationModal from '@/components/modals/LocationModal';
import { OrderProcessModalProps, OrderStep, PaymentMethod } from '@/types/global';
import { paymentMethods } from '@/data/paymentMethods.data';

const OrderProcessModal: React.FC<OrderProcessModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  isAdminSimulation = false
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentUser, addOrder, clearCart } = useStore();
  
  const [currentStep, setCurrentStep] = useState<OrderStep>('auth');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);



  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      if (!currentUser && !isAdminSimulation) {
        setCurrentStep('auth');
      } else {
        setCurrentStep('location');
      }
      setIsLocationValid(false);
      setUserLocation(null);
    }
  }, [isOpen, currentUser, isAdminSimulation]);

  const checkUserLocation = async () => {
    if (isAdminSimulation) {
      setIsLocationValid(true);
      setCurrentStep('payment');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      
      // Coordonnées du restaurant (exemple)
      const restaurantLat = 48.8566;
      const restaurantLng = 2.3522;
      
      // Calculer la distance
      const distance = calculateDistance(userLat, userLng, restaurantLat, restaurantLng);
      
      setUserLocation({ lat: userLat, lng: userLng });
      
      if (distance <= 100) { // 100 mètres
        setIsLocationValid(true);
        setCurrentStep('payment');
        toast({
          title: t('common.success'),
          description: 'Localisation validée',
        });
      } else {
        setShowLocationModal(true);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Impossible d\'obtenir votre localisation',
        variant: 'destructive'
      });
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance en mètres
  };

  const handleConfirmOrder = () => {
    const orderData = {
      userId: currentUser?.id || 'admin-simulation',
      items: cartItems,
      total: totalAmount,
      status: 'pending' as const,
      customerName: currentUser?.name || 'Admin Simulation',
      customerPhone: currentUser?.phone,
      customerEmail: currentUser?.email,
      paymentMethod: selectedPaymentMethod,
      isSimulation: isAdminSimulation
    };

    const orderId = addOrder(orderData);
    clearCart();
    
    setCurrentStep('confirmation');
    
    toast({
      title: t('order.orderConfirmed'),
      description: `Commande #${orderId.slice(-6)} confirmée`,
    });

    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const renderAuthStep = () => (
    <div className="text-center py-8">
      <User className="w-16 h-16 mx-auto mb-4 text-orange-500" />
      <h3 className="text-xl font-semibold mb-2">{t('order.loginRequired')}</h3>
      <p className="text-gray-600 mb-6">{t('order.loginMessage')}</p>
      <Button 
        onClick={() => setShowAuthModal(true)}
        className="bg-gradient-to-r from-orange-500 to-yellow-500"
      >
        {t('nav.login')}
      </Button>
    </div>
  );

  const renderLocationStep = () => (
    <div className="text-center py-8">
      <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-500" />
      <h3 className="text-xl font-semibold mb-2">{t('order.locationCheck')}</h3>
      <p className="text-gray-600 mb-6">
        Nous devons vérifier que vous êtes dans le restaurant pour passer commande
      </p>
      <Button 
        onClick={checkUserLocation}
        className="bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Vérifier ma position
      </Button>
      {isAdminSimulation && (
        <div className="mt-4">
          <Badge variant="secondary">{t('order.simulate')}</Badge>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="py-6">
      <h3 className="text-xl font-semibold mb-6 text-center">{t('order.choosePayment')}</h3>
      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPaymentMethod === method.id 
                  ? 'ring-2 ring-orange-500 border-orange-500' 
                  : ''
              }`}
              onClick={() => setSelectedPaymentMethod(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${method.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <Check className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Total:</span>
          <span className="text-2xl font-bold text-orange-500">
            {totalAmount.toLocaleString()} FCFA
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {cartItems.length} article(s) dans votre commande
        </p>
      </div>
      
      <Button 
        onClick={handleConfirmOrder}
        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500"
        size="lg"
      >
        {t('order.confirmOrder')}
      </Button>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Check className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 text-green-600">
        {t('order.orderConfirmed')}
      </h3>
      <p className="text-gray-600 mb-4">
        Votre commande a été confirmée avec succès !
      </p>
      <p className="text-sm text-gray-500">
        Temps d'attente estimé: 15-20 minutes
      </p>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('order.title')}</DialogTitle>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'auth' && renderAuthStep()}
              {currentStep === 'location' && renderLocationStep()}
              {currentStep === 'payment' && renderPaymentStep()}
              {currentStep === 'confirmation' && renderConfirmationStep()}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <EnhancedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setCurrentStep('location');
        }}
      />

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        distance={userLocation ? calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          48.8566, 
          2.3522
        ) : undefined}
        onRetry={checkUserLocation}
      />
    </>
  );
};

export default OrderProcessModal;
