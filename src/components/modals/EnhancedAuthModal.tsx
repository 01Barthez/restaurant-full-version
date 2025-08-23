
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Star, Trophy, User, Lock, Phone, Mail } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { EnhancedAuthModalProps } from '@/types/global';

const EnhancedAuthModal: React.FC<EnhancedAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Connexion requise",
  description = "Connectez-vous pour passer commande"
}) => {
  const [loginData, setLoginData] = useState({ name: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    password: '' 
  });
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useStore();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginData)) {
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue ! Vous pouvez maintenant passer commande.",
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
        description: "Bienvenue ! Vous avez gagné 50 points de fidélité.",
      });
      onClose();
      onSuccess?.();
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "Programme de Fidélité",
      description: "Gagnez des points à chaque commande"
    },
    {
      icon: Star,
      title: "Réductions Exclusives",
      description: "10% de réduction après 5 commandes"
    },
    {
      icon: Trophy,
      title: "Accès Prioritaire",
      description: "Nouveautés et offres en avant-première"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-bold text-restaurant-dark">
                  {title}
                </DialogTitle>
                <p className="text-gray-600 mt-2">{description}</p>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Se Connecter</TabsTrigger>
                  <TabsTrigger value="register">Créer un Compte</TabsTrigger>
                </TabsList>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-name" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Nom d'utilisateur
                        </Label>
                        <Input
                          id="login-name"
                          value={loginData.name}
                          onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                          placeholder="Votre nom d'utilisateur"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password" className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Mot de passe
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Votre mot de passe"
                          required
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                      >
                        Se Connecter
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4 mt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Nom complet *
                        </Label>
                        <Input
                          id="register-name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          placeholder="Votre nom complet"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-phone" className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Téléphone *
                        </Label>
                        <Input
                          id="register-phone"
                          type="tel"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          placeholder="Votre numéro de téléphone"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-email" className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email (optionnel)
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="votre@email.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-password" className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Mot de passe *
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Choisissez un mot de passe"
                          required
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                      >
                        Créer mon Compte
                      </Button>
                    </form>
                  </TabsContent>
                </motion.div>
              </Tabs>

              {/* Benefits Section */}
              <motion.div 
                className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-semibold text-restaurant-dark mb-3 text-center">
                  Pourquoi créer un compte ?
                </h4>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <motion.div 
                        key={index} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <IconComponent className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-sm text-restaurant-dark">
                            {benefit.title}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EnhancedAuthModal;
