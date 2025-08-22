
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, ShoppingBag, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-restaurant-orange text-white">
              {currentUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border shadow-lg z-50" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{currentUser.name}</p>
            {currentUser.email && (
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            )}
            <p className="text-xs text-restaurant-orange">
              {currentUser.loyaltyPoints} points fidélité
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/user/${currentUser.id}`)}>
          <User className="mr-2 h-4 w-4" />
          Mon Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/user/${currentUser.id}/orders`)}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Mes Commandes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/user/${currentUser.id}/settings`)}>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
