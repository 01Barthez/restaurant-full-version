
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Star, Trophy } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loginData, setLoginData] = useState({ name: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    password: '' 
  });
  const { login, register } = useStore();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginData)) {
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue ! Profitez de votre expérience culinaire.",
      });
      onClose();
      onSuccess?.();
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(registerData)) {
      toast({
        title: "Compte créé avec succès !",
        description: "Bienvenue dans notre famille ! Vous avez gagné 50 points de fidélité.",
      });
      onClose();
      onSuccess?.();
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "Programme de Fidélité",
      description: "Gagnez des points à chaque commande et débloquez des récompenses exclusives"
    },
    {
      icon: Star,
      title: "Réductions Exclusives",
      description: "Après 5 commandes, bénéficiez de 10% de réduction automatique"
    },
    {
      icon: Trophy,
      title: "Accès Prioritaire",
      description: "Soyez les premiers informés de nos nouveautés et offres spéciales"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-restaurant-dark">
            Rejoignez Le Délice Moderne
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se Connecter</TabsTrigger>
            <TabsTrigger value="register">Créer un Compte</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-name">Nom</Label>
                <Input
                  id="login-name"
                  value={loginData.name}
                  onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-restaurant-gradient">
                Se Connecter
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name">Nom *</Label>
                <Input
                  id="register-name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-phone">Numéro de téléphone *</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email">Adresse Email (optionnel)</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="register-password">Mot de passe *</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-restaurant-gradient">
                Créer mon Compte
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Benefits Section */}
        <div className="mt-6 p-4 bg-restaurant-cream/30 rounded-lg">
          <h4 className="font-semibold text-restaurant-dark mb-3 text-center">
            Pourquoi créer un compte ?
          </h4>
          <div className="space-y-3">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <IconComponent className="w-5 h-5 text-restaurant-orange mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-restaurant-dark">
                      {benefit.title}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
