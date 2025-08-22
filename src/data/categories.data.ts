import { ChefHat, Coffee, Cookie, Plus } from 'lucide-react';


export const categories = [
    {
      id: 'boissons',
      name: 'Boissons',
      description: 'Jus, sodas, cafés et thés',
      icon: Coffee,
      color: 'bg-blue-500',
      count: 15
    },
    {
      id: 'plats',
      name: 'Plats Principaux',
      description: 'Riz, viandes, poissons',
      icon: ChefHat,
      color: 'bg-red-500',
      count: 25
    },
    {
      id: 'desserts',
      name: 'Desserts',
      description: 'Pâtisseries et douceurs',
      icon: Cookie,
      color: 'bg-pink-500',
      count: 12
    },
    {
      id: 'supplements',
      name: 'Suppléments',
      description: 'Accompagnements et extras',
      icon: Plus,
      color: 'bg-green-500',
      count: 8
    }
  ];
