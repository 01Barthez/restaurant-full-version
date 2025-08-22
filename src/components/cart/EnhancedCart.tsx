
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import OrderProcessModal from '@/components/order/OrderProcessModal';

const EnhancedCart: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { cart, updateCartQuantity, removeFromCart, clearCart, currentUser } = useStore();
  const [showOrderProcess, setShowOrderProcess] = useState(false);
  const [isAdminSimulation, setIsAdminSimulation] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast({
      title: t('common.success'),
      description: t('cart.remove'),
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: t('common.success'),
      description: 'Panier vidé',
    });
  };

  const handleCheckout = (adminSimulation = false) => {
    if (cart.length === 0) {
      toast({
        title: t('common.error'),
        description: t('cart.empty'),
        variant: 'destructive'
      });
      return;
    }

    setIsAdminSimulation(adminSimulation);
    setShowOrderProcess(true);
  };

  if (cart.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('cart.title')} ({itemCount})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleClearCart}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <p className="text-orange-500 font-semibold">{item.price.toLocaleString()} FCFA</p>
                {item.specialRequests && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note: {item.specialRequests}
                  </p>
                )}
                {item.isOffer && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Offre spéciale
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="font-medium min-w-[20px] text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('cart.total')}:</span>
              <span className="text-2xl font-bold text-orange-500">
                {totalAmount.toLocaleString()} FCFA
              </span>
            </div>
            
            <Button
              onClick={() => handleCheckout(false)}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('cart.checkout')}
            </Button>

            {/* Bouton Admin pour simulation */}
            <Button
              onClick={() => handleCheckout(true)}
              variant="outline"
              className="w-full border-dashed"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              {t('order.simulate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <OrderProcessModal
        isOpen={showOrderProcess}
        onClose={() => setShowOrderProcess(false)}
        cartItems={cart}
        totalAmount={totalAmount}
        isAdminSimulation={isAdminSimulation}
      />
    </>
  );
};

export default EnhancedCart;
