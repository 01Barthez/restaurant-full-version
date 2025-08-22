import { Gift, Percent, Users } from 'lucide-react';
  export const offers = [
    {
      id: 'pack-famille',
      title: 'Pack Famille',
      description: '2 Plats + 2 Boissons + 1 Dessert',
      originalPrice: 45.00,
      discountPrice: 35.00,
      discount: '22%',
      icon: Users,
      color: 'bg-green-500',
      badge: 'Populaire'
    },
    {
      id: 'menu-midi',
      title: 'Menu Midi Express',
      description: '1 Plat + 1 Boisson + 1 Café',
      originalPrice: 18.00,
      discountPrice: 15.00,
      discount: '17%',
      icon: Percent,
      color: 'bg-blue-500',
      badge: 'Nouveau'
    },
    {
      id: 'pack-gros',
      title: 'Commande Groupée',
      description: '10 Plats identiques - 10% de réduction',
      originalPrice: 120.00,
      discountPrice: 108.00,
      discount: '10%',
      icon: Gift,
      color: 'bg-purple-500',
      badge: 'Économie'
    },
    {
      id: 'pack-weekend',
      title: 'Pack Week-end',
      description: '3 Plats + 3 Boissons + Dessert Offert',
      originalPrice: 52.00,
      discountPrice: 42.00,
      discount: '19%',
      icon: Gift,
      color: 'bg-red-500',
      badge: 'Week-end'
    },
    {
      id: 'menu-etudiant',
      title: 'Menu Étudiant',
      description: '1 Plat + 1 Boisson (avec carte étudiante)',
      originalPrice: 15.00,
      discountPrice: 12.00,
      discount: '20%',
      icon: Percent,
      color: 'bg-orange-500',
      badge: 'Étudiant'
    }
  ];