import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItem } from '@/types/global';
import HomePage from '@/components/HomePage';
import MenuPage from '@/components/MenuPage';
import MenuDetail from '@/components/MenuDetail';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import SEOHelmet from '@/components/SEO/SEOHelmet';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/Layout/footer/Footer';
import Navigation from '@/Layout/Navigation';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/menu')) return 'menu';
    return 'home';
  };

  const currentPage = getCurrentPage();
  const isMenuItemPage = location.pathname.startsWith('/menu/');

  const handleItemSelect = (itemOrId: MenuItem | string) => {
    if (typeof itemOrId === 'string') {
      navigate(`/menu/${itemOrId}`);
    } else {
      navigate(`/menu/${itemOrId.id}`);
    }
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleMenuClick = () => {
    navigate('/menu');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    navigate('/menu');
  };

  const handleOrder = (item: MenuItem) => {
    toast({
      title: "Commande ajoutée !",
      description: `${item.name} a été ajouté à votre commande.`,
      duration: 3000,
    });
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Utilisez admin/admin123.",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  const handleAdminLogout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
    navigate('/');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'administration.",
      duration: 3000,
    });
  };

  const handleBackToApp = () => {
    setIsAdminMode(false);
    navigate('/');
  };

  // Admin mode rendering
  if (isAdminMode) {
    if (!isLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} onBack={handleBackToApp} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // Main app rendering
  return (
    <>
      <SEOHelmet
        title={currentPage === 'menu' ? 'Menu - Le Délice Moderne' : 'Accueil - Le Délice Moderne'}
        description={currentPage === 'menu'
          ? 'Découvrez notre carte complète de plats camerounais authentiques. Commandez en ligne et profitez de la livraison rapide.'
          : 'Bienvenue au Délice Moderne, votre restaurant camerounais de référence. Découvrez nos spécialités traditionnelles et commandez en ligne.'}
        keywords={currentPage === 'menu'
          ? 'menu camerounais, plats traditionnels, commande en ligne, livraison restaurant'
          : 'restaurant camerounais, cuisine africaine, spécialités camerounaises, livraison yaoundé'}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation />

        {
          currentPage === 'home' &&
          <HomePage
            onMenuClick={handleMenuClick}
            onItemSelect={handleItemSelect}
            onCategorySelect={handleCategorySelect}
          />
        }

        {currentPage === 'menu' && !isMenuItemPage && (
          <MenuPage
            onItemSelect={handleItemSelect}
            selectedCategory={selectedCategory !== 'all' ? selectedCategory : 'all'}
          />
        )}

        {isMenuItemPage && (
          <MenuDetail onBack={handleBackToMenu} onOrder={handleOrder} />
        )}

        {!isMenuItemPage && <Footer />}
      </div>
    </>
  );
};

export default Home;
