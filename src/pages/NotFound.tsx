
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Menu, 
  Phone, 
  ArrowLeft,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import PageTransition from "@/components/ui/PageTransition";
import Footer from "@/Layout/Footer";
import Navigation from "../Layout/Navigation";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    { path: "/", label: "Accueil", icon: Home, description: "Retourner à la page principale" },
    { path: "/menu", label: "Notre Menu", icon: Menu, description: "Découvrir nos plats" },
    { path: "/about", label: "À Propos", icon: Star, description: "En savoir plus sur nous" },
    { path: "/contact", label: "Contact", icon: Phone, description: "Nous contacter" }
  ];

  const popularPages = [
    { path: "/about-rewards", label: "Programme Fidélité", visits: "2.1k" },
    { path: "/gallery", label: "Galerie Photos", visits: "1.8k" },
    { path: "/admin/login", label: "Administration", visits: "892" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirection intelligente basée sur le terme de recherche
      const term = searchTerm.toLowerCase();
      if (term.includes('menu') || term.includes('plat') || term.includes('nourriture')) {
        navigate('/menu');
      } else if (term.includes('contact') || term.includes('téléphone') || term.includes('adresse')) {
        navigate('/contact');
      } else if (term.includes('admin') || term.includes('administration')) {
        navigate('/admin/login');
      } else if (term.includes('fidélité') || term.includes('point') || term.includes('récompense')) {
        navigate('/about-rewards');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <>
      <SEOHelmet
        title="Page non trouvée - 404"
        description="La page que vous recherchez n'existe pas. Découvrez nos liens rapides pour naviguer facilement sur Le Délice Moderne."
        keywords="404, page non trouvée, navigation, menu, restaurant"
      />
      
      <PageTransition className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation 
          currentPage="404" 
          onPageChange={(page) => navigate(page === 'home' ? '/' : `/${page}`)} 
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="text-9xl font-bold text-orange-500 mb-4 animate-bounce">
                404
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Cette page n'existe pas
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé. 
                Mais ne vous inquiétez pas, nous pouvons vous aider à trouver ce que vous cherchez!
              </p>
              
              {/* Recherche intelligente */}
              <Card className="max-w-md mx-auto mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Recherche Intelligente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Ex: menu, contact, admin..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">
                    Tapez un mot-clé et nous vous redirigerons vers la bonne page
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Navigation Rapide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>Navigation Rapide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Button
                        key={link.path}
                        variant="outline"
                        className="w-full justify-start h-auto p-4 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        onClick={() => navigate(link.path)}
                      >
                        <IconComponent className="w-5 h-5 mr-3 text-orange-500" />
                        <div className="text-left">
                          <div className="font-semibold">{link.label}</div>
                          <div className="text-sm text-gray-500">{link.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Pages Populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    <span>Pages Populaires</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {popularPages.map((page) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => navigate(page.path)}
                    >
                      <span className="font-medium">{page.label}</span>
                      <Badge variant="secondary">{page.visits} visites</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Informations Contact */}
            <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Besoin d'Aide?</h3>
                <p className="mb-6 opacity-90">
                  Notre équipe est là pour vous aider. Contactez-nous si vous ne trouvez pas ce que vous cherchez.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Lun-Dim: 11h00 - 23h00</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/contact')}
                    className="bg-white text-orange-600 hover:bg-gray-100"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Nous Contacter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-white text-white hover:bg-white hover:text-orange-600"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Page Précédente
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Erreur technique */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>URL demandée: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{location.pathname}</code></p>
              <p className="mt-2">Si cette page devrait exister, veuillez nous contacter.</p>
            </div>
          </div>
        </div>

        <Footer />
      </PageTransition>
    </>
  );
};

export default NotFound;
