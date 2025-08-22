import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import ReviewSystem from '@/components/reviews/ReviewSystem';
import LazyImage from '@/components/ui/LazyImage';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { MenuItem } from '@/types/restaurant';
import { menuItems } from '@/data/mockData';
import LoaderPage from '@/Layout/LoaderPage';
import NotFound from './NotFound';
import HeroSection from '@/components/common/HeroSection';
import { HERO_CONTENT } from '@/constants/heroSections';
import Navigation from '../Layout/Navigation';
import Footer from '@/Layout/Footer';

const MenuDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { addToCart, reviews, addReview, getMenuItemReviews } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const foundItem = menuItems.find(item => item.id === id);
    setItem(foundItem || null);
    setIsLoading(false);
  }, [id]);

  if (isLoading) return <LoaderPage />;
  if (!item) return <NotFound />

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
      image: item.image || '/placeholder.svg'
    });

    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`,
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
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papiers",
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
    <>
      <SEOHelmet
        title={`${item.name} - Le Délice Moderne`}
        description={item.description}
        type="article"
        image={item.image}
        keywords={`${item.name}, ${item.category}, plat camerounais, ${item.ingredients?.join(', ')}, restaurant délice moderne`}
      />

      <Navigation currentPage="menu" onPageChange={() => { }} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection
          image={`MENU_DETAIL`}
          span={HERO_CONTENT.MENU_DETAIL.span}
          title={HERO_CONTENT.MENU_DETAIL.title}
          description={HERO_CONTENT.MENU_DETAIL.description}
          showBackButton
        />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <LazyImage
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
                fallbackSrc="/placeholder.svg"
              />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-foreground">
                    {item.name}
                  </h1>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {item.price.toLocaleString()} FCFA
                  </span>
                  {averageRating > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm text-muted-foreground">
                        {averageRating.toFixed(1)} ({itemReviews.length} avis)
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Ingrédients :</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Temps de préparation : {item.preparationTime} minutes
                  </p>
                </div>

                {item.nutritionalInfo && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Informations nutritionnelles :</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Calories : {item.nutritionalInfo.calories}</div>
                      <div>Protéines : {item.nutritionalInfo.protein}g</div>
                      <div>Glucides : {item.nutritionalInfo.carbs}g</div>
                      <div>Lipides : {item.nutritionalInfo.fat}g</div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {item.available ? 'Ajouter au panier' : 'Non disponible'}
                </Button>
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

        <Footer />
      </div>
    </>
  );
};

export default MenuDetail;