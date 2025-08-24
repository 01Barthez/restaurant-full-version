import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import useStore from '@/store/useStore';
import { MenuItem, Review } from '@/types/global';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, ArrowLeft } from 'lucide-react';
import MenuCard from './MenuCard';
import LoaderPage from '@/Layout/LoaderPage';
import NotFound from '@/pages/NotFound';
import HeroSection from './common/HeroSection';
import OptimizedLazyImage from './ui/OptimizedLazyImage';

interface MenuDetailProps {
  item?: MenuItem;
  onBack?: () => void;
  onOrder?: (item: MenuItem) => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({ item: propItem, onBack, onOrder }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { menuItems, addToCart, getMenuItemReviews, initializeTestData } = useStore();
  
  const [isLoading, setIsLoading] = useState(!propItem);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(propItem || null);
  // La galerie d'images utilise directement l'index 0 pour le moment
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [itemReviews, setItemReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  // Charger l'élément depuis l'ID de l'URL si nécessaire
  useEffect(() => {
    const loadMenuItem = async () => {
      if (!id || propItem) return;

      console.log('Searching for menu item with ID:', id, 'Type:', typeof id);
      
      // Vérifier d'abord dans les éléments existants
      const existingItem = menuItems.find((item: MenuItem) => String(item.id) === String(id));
      
      if (existingItem) {
        console.log('Found item in existing menu items:', existingItem.name);
        setCurrentItem(existingItem);
        setIsLoading(false);
        return;
      }
      
      // Si l'élément n'est pas trouvé, essayer d'initialiser les données
      if (menuItems.length === 0 && initializeTestData) {
        console.log('Initializing test data...');
        try {
          await initializeTestData();
          // Le composant sera re-rendu avec les nouvelles données
          return;
        } catch (error) {
          console.error('Failed to initialize test data:', error);
        }
      }
      
      // Si on arrive ici, l'élément n'existe vraiment pas
      console.error('Menu item not found for ID:', id);
      console.log('Available IDs:', menuItems.map((item: MenuItem) => `${item.id}: ${item.name}`));
      setIsLoading(false);
    };
    
    loadMenuItem();
  }, [id, menuItems, propItem, initializeTestData]);

  // Charger les avis pour l'élément actuel
  useEffect(() => {
    if (currentItem) {
      const reviews = getMenuItemReviews ? getMenuItemReviews(currentItem.id) : [];
      setItemReviews(reviews);
      
      // Calculer la note moyenne
      if (reviews.length > 0) {
        const sum = reviews.reduce((total: number, review: Review) => total + (review.rating || 0), 0);
        setAverageRating(sum / reviews.length);
      }
    }
  }, [currentItem, getMenuItemReviews]);

  // Gérer les images
  const images = useMemo(() => {
    const defaultImage = '/placeholder.svg';
    if (!currentItem) return [defaultImage];

    if (Array.isArray(currentItem.images)) {
      const validImages = currentItem.images
        .filter((img): img is string => Boolean(img) && typeof img === 'string' && img.trim() !== '');
      if (validImages.length > 0) return validImages;
    }

    if (typeof currentItem.image === 'string' && currentItem.image.trim() !== '') {
      return [currentItem.image];
    }

    return [defaultImage];
  }, [currentItem]);

  // Gestionnaires d'événements
  const handleBack = () => onBack ? onBack() : navigate(-1);
  
  const handleOrder = (menuItem: MenuItem) => {
    if (onOrder) {
      onOrder(menuItem);
    } else {
      addToCart({
        ...menuItem,
        quantity: 1,
        specialRequests: specialRequests
      });
      toast({
        title: t('cart.addedToCart'),
        description: t('cart.itemAdded', { name: menuItem.name }),
      });
    }
  };

  // Afficher le loader pendant le chargement
  if (isLoading) return <LoaderPage />;
  if (!currentItem) return <NotFound />;

  // Trouver des articles similaires
  const similarItems = menuItems
    .filter((item: MenuItem) => item.id !== currentItem.id && item.category === currentItem.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <HeroSection
          image="MENU_DETAIL"
          span="Détails"
          title={currentItem.name}
          description={currentItem.description || ''}
          className="mb-8"
        />

        <Card className="overflow-hidden mb-8 shadow-lg">
          <div className="lg:flex bg-white dark:bg-gray-800">
            {/* Image Gallery */}
            <div className="lg:w-1/2">
              <div className="relative overflow-hidden">
                <div className="aspect-w-1 aspect-h-1">
                  {images.length > 0 ? (
                    <OptimizedLazyImage
                      src={images[0] || '/placeholder.svg'}
                      alt={currentItem.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      priority={true}
                      quality={85}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">Image non disponible</span>
                    </div>
                  )}
                </div>
                {currentItem.featured && (
                  <Badge className="absolute top-4 left-4 bg-restaurant-gold text-restaurant-dark flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {t('common.featured')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Détails du produit */}
            <div className="lg:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentItem.name}
                  </h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      ({itemReviews.length} {t('reviews.count')})
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(currentItem.price)}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('menu.description')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {showFullDescription
                    ? currentItem.description
                    : `${currentItem.description.substring(0, 200)}${currentItem.description.length > 200 ? '...' : ''}`}
                </p>
                {currentItem.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    {showFullDescription ? t('common.showLess') : t('common.readMore')}
                  </button>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('menu.specialRequests')}
                </label>
                <textarea
                  id="special-requests"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder={t('menu.specialRequestsPlaceholder')}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <div className="mt-8 flex items-center">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={() => handleOrder(currentItem)}
                  className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {t('cart.addToCart')}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Articles similaires */}
        {similarItems.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-restaurant-dark dark:text-white">
                {t('menu.similarItems')}
              </h2>
              <Button variant="outline" onClick={handleBack}>
                {t('menu.viewAllItems')}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarItems.map((item: MenuItem, index: number) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MenuCard 
                    item={item} 
                    onSelect={() => onOrder ? onOrder(item) : handleOrder(item)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDetail;
