
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import Navigation from '@/Layout/Navigation';
import Footer from '@/Layout/footer/Footer';
import OfferGallery from '@/components/offer/OfferGallery';
import OfferInfo from '@/components/offer/OfferInfo';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { offers as staticOffers } from '@/data/offers.data';
import { HERO_CONTENT } from '@/constants/heroSections';
import HeroSection from '@/components/common/HeroSection';
import NotFoundSpecialOfferDetail from './NotFoundSpecialOfferDetail';

const SpecialOfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { offers, menuItems, addToCart } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  // Find the offer from store; if missing, fallback to static data
  const storeOffer = offers.find(o => o.id === id);
  const fallback = staticOffers.find(o => o.id === id);
  const offer = storeOffer || (fallback
    ? {
      id: fallback.id,
      title: fallback.title,
      description: fallback.description,
      items: [],
      originalPrice: fallback.originalPrice,
      discountPrice: fallback.discountPrice,
      discount: fallback.discount,
      image: '/placeholder.svg',
      available: true
    }
    : undefined);

  if (!offer) return <NotFoundSpecialOfferDetail />

  // Get offer items
  const offerItems = offer.items.map(offerItem => {
    const menuItem = menuItems.find(item => item.id === offerItem.menuItemId);
    return menuItem;
  }).filter(Boolean) as any[];

  const handleAddToCart = () => {
    if (!offer.available) {
      toast({
        title: "Unavailable",
        description: "This offer is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    // Add the entire offer as a special cart item
    const cartItem = {
      id: `offer-${offer.id}-${Date.now()}`,
      name: offer.title,
      price: offer.discountPrice,
      quantity,
      image: offer.image,
      specialRequests,
      isOffer: true,
      offerItems: offerItems
    };

    addToCart(cartItem);

    toast({
      title: "Added to cart!",
      description: `${offer.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      {/* Hero Section */}
      <HeroSection
        image={`SPECIAL_OFFER`}
        span={HERO_CONTENT.SPECIAL_OFFER.span}
        title={HERO_CONTENT.SPECIAL_OFFER.title}
        description={HERO_CONTENT.SPECIAL_OFFER.description}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <OfferGallery
              images={[offer.image]}
              title={offer.title}
            />
          </div>

          <div>
            <OfferInfo offer={offer} items={offerItems} />

            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Customize Your Order</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="special-requests">Special Requests</Label>
                  <Textarea
                    id="special-requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requests or dietary requirements..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-orange-500">
                      Total: {(offer.discountPrice * quantity).toFixed(2)}€
                    </p>
                    <p className="text-sm text-gray-500">
                      {quantity} × {offer.discountPrice.toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      disabled={!offer.available}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpecialOfferDetail;
