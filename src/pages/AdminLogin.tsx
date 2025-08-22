
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/Layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const getCurrentPage = () => {
    return 'admin';
  };

  const handlePageChange = (page: string) => {
    const routes = {
      'home': '/',
      'menu': '/menu',
      'about': '/about',
      'contact': '/contact'
    };
    navigate(routes[page as keyof typeof routes] || '/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration.",
        duration: 3000,
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Utilisez admin/admin123.",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
      />
      
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          <Card className="shadow-xl dark:bg-gray-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-orange-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Administration
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Connectez-vous pour accéder au panel d'administration
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    placeholder="admin"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="admin123"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                  <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </div>
              </form>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong>Identifiants de démonstration :</strong><br />
                  Utilisateur : admin<br />
                  Mot de passe : admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
