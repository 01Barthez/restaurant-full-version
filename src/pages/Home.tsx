import React, { useState, useEffect } from 'react';
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
import { menuItems } from '@/data/menuItems.data';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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

  // Handle menu item selection from URL params
  useEffect(() => {
    const path = location.pathname;
    const menuItemMatch = path.match(/\/menu\/(.+)/);

    if (menuItemMatch) {
      const itemId = menuItemMatch[1];
      const item = menuItems.find(i => i.id === itemId);
      if (item) {
        setSelectedItem(item);
      }
    } else {
      setSelectedItem(null);
    }
  }, [location.pathname]);

  const handlePageChange = (page: string) => {
    const routes = {
      'home': '/',
      'menu': '/menu'
    };
    navigate(routes[page as keyof typeof routes] || '/');
  };

  const handleItemSelect = (itemOrId: MenuItem | string) => {
    const item = typeof itemOrId === 'string'
      ? menuItems.find(i => i.id === itemOrId)
      : itemOrId;

    if (item) {
      navigate(`/menu/${item.id}`);
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

  const handleAdminClick = () => {
    setIsAdminMode(true);
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

      {currentPage === 'home' && (
        <>
          <HomePage
            onMenuClick={handleMenuClick}
            onItemSelect={handleItemSelect}
            onCategorySelect={handleCategorySelect}
          />
          <Footer />
        </>
      )}

      {currentPage === 'menu' && !selectedItem && (
        <>
          <MenuPage
            onItemSelect={handleItemSelect}
            selectedCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
          />
          <Footer />
        </>
      )}

      {selectedItem && (
        <>
          <MenuDetail />
          <Footer />
        </>
      )}
    </div>
    </>
  );
};

export default Home;
