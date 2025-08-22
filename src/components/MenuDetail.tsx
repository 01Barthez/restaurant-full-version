
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import MenuInfo from '@/components/menu/MenuInfo';
import MenuActions from '@/components/menu/MenuActions';
import ReviewSystem from '@/components/reviews/ReviewSystem';
import LazyImage from '@/components/ui/LazyImage';

const MenuDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { menuItems, addToCart, reviews, addReview, getMenuItemReviews } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);

  // Si pas d'éléments de menu dans le store, on crée des données de test
  const testMenuItems = menuItems.length === 0 ? [
    {
      id: '1',
      name: 'Coq au Vin',
      description: 'Poulet mijoté dans du vin rouge avec des champignons et des lardons',
      price: 24.50,
      images: ['/placeholder.svg'],
      category: 'mains',
      ingredients: ['Poulet', 'Vin rouge', 'Champignons', 'Lardons', 'Oignons'],
      available: true,
      featured: true,
      preparationTime: 25,
      dietary: [],
      nutritionalInfo: {
        calories: 450,
        protein: 35,
        carbs: 8,
        fat: 20
      }
    },
    {
      id: '2',
      name: 'Ratatouille Provençale',
      description: 'Légumes de saison mijotés aux herbes de Provence',
      price: 18.00,
      images: ['/placeholder.svg'],
      category: 'mains',
      ingredients: ['Aubergines', 'Courgettes', 'Tomates', 'Poivrons', 'Herbes de Provence'],
      available: true,
      featured: false,
      preparationTime: 20,
      dietary: ['vegetarian', 'vegan'],
      nutritionalInfo: {
        calories: 180,
        protein: 6,
        carbs: 25,
        fat: 8
      }
    }
  ] : menuItems;

  const item = testMenuItems.find(item => item.id === id);
  
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('menu.itemNotFound')}
          </h2>
          <Button onClick={() => navigate('/menu')} className="text-orange-500 hover:text-orange-600">
            {t('menu.backToMenu')}
          </Button>
        </div>
      </div>
    );
  }

  const itemReviews = getMenuItemReviews ? getMenuItemReviews(item.id) : [];
  const averageRating = itemReviews.length > 0 
    ? itemReviews.reduce((sum, review) => sum + review.rating, 0) / itemReviews.length 
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images[0] || '/placeholder.svg'
    });

    toast({
      title: t('cart.title'),
      description: `${item.name} ${t('menu.addToCart')}`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: item.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('common.success'),
        description: "Lien copié dans le presse-papiers",
      });
    }
  };

  const handleAddReview = (reviewData: any) => {
    if (addReview) {
      addReview({
        ...reviewData,
        menuItemId: item.id
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <LazyImage
              src={item.images[0] || '/placeholder.svg'}
              alt={item.name}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
              fallbackSrc="/placeholder.svg"
            />
          </div>

          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {item.name}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-orange-500">
                  {item.price.toLocaleString()} FCFA
                </span>
                {averageRating > 0 && (
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({itemReviews.length})
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">{t('menu.ingredients')}:</h3>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('menu.preparationTime')}: {item.preparationTime} {t('menu.minutes')}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('menu.addToCart')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {addReview && (
          <ReviewSystem
            menuItemId={item.id}
            reviews={itemReviews}
            onAddReview={handleAddReview}
          />
        )}
      </div>
    </div>
  );
};

export default MenuDetail;
