export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  fullDescription: string;
  capacity: number;
  terrace: number;
  parking: boolean;
  accessible: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  specialties: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  website?: string;
  rating: number;
  events?: {
    title: string;
    date: string;
    description: string;
  }[];
}

export const restaurants = [
  {
    id: 'bastos',
    name: 'Le Délice Moderne - Bastos',
    address: "Avenue Jean-Paul II, face à l'Ambassade de France, Yaoundé",
    phone: '+237 6 94 12 34 56',
    email: 'bastos@delicemoderne.cm',
    hours: 'Lun-Dim: 10h00 - 23h00',
    description:
      'Notre établissement phare dans le quartier huppé de Bastos, proposant une cuisine raffinée dans un cadre élégant.',
    fullDescription:
      'Situé dans le quartier diplomatique de Bastos, notre restaurant offre une expérience culinaire exceptionnelle avec une vue imprenable sur la ville. Notre chef étoilé revisite les classiques de la cuisine camerounaise avec des touches modernes et des produits frais du marché local.',
    capacity: 100,
    terrace: 30,
    parking: true,
    accessible: true,
    coordinates: {
      lat: 3.8688,
      lng: 11.5214,
    },
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1519709042477-8de6eaf1fdc5?auto=format&fit=crop&w=800',
    ],
    specialties: [
      'Cuisine Camerounaise Moderne',
      'Poissons Grillés',
      'Cocktails Maison',
    ],
    socialMedia: {
      facebook: 'delicemoderne.bastos',
      instagram: 'delicemoderne_bastos',
      twitter: 'delicemoderne_bs',
    },
    website: 'https://delicemoderne.cm/bastos',
    rating: 4.8,
  },
  {
    id: 'bonapriso',
    name: 'Le Délice Moderne - Bonapriso',
    address: 'Carrefour Bonapriso, face au Marché Central, Yaoundé',
    phone: '+237 6 95 67 89 01',
    email: 'bonapriso@delicemoderne.cm',
    hours: 'Lun-Dim: 08h00 - 22h30',
    description:
      'Un cadre chaleureux au cœur du quartier animé de Bonapriso, idéal pour les repas en famille.',
    fullDescription:
      "Notre établissement de Bonapriso allie tradition et modernité dans un cadre convivial. Spécialisés dans les plats traditionnels camerounais, nous mettons un point d'honneur à utiliser des produits frais et locaux. Notre terrasse ombragée est parfaite pour déjeuner en plein air.",
    capacity: 80,
    terrace: 25,
    parking: true,
    accessible: true,
    coordinates: {
      lat: 3.8609,
      lng: 11.5167,
    },
    images: [
      'https://images.unsplash.com/photo-1552566197-ddc8ec3df29a?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1517248132813-414ebdf194d7?auto=format&fit=crop&w=800',
    ],
    specialties: ['Ndolé', 'Poulet DG', 'Plats Végétariens'],
    socialMedia: {
      facebook: 'delicemoderne.bonapriso',
      instagram: 'delicemoderne_bonapriso',
    },
    website: 'https://delicemoderne.cm/bonapriso',
    rating: 4.5,
  },
  {
    id: 'bonanjo',
    name: 'Le Délice Moderne - Bonanjo',
    address: 'Avenue Charles de Gaulle, face au Palais des Congrès, Yaoundé',
    phone: '+237 6 90 12 34 56',
    email: 'bonanjo@delicemoderne.cm',
    hours: 'Lun-Sam: 11h00 - 23h00 | Dim: 12h00 - 22h00',
    description:
      "Un lieu branché au cœur du quartier des affaires, parfait pour les déjeuners d'affaires.",
    fullDescription:
      "Situé dans le quartier dynamique de Bonanjo, notre restaurant allie efficacité et raffinement. Avec son cadre moderne et ses espaces modulables, c'est l'endroit idéal pour organiser vos réunions d'affaires ou vos déjeuners professionnels. Notre menu business est conçu pour les professionnels pressés.",
    capacity: 120,
    terrace: 15,
    parking: true,
    accessible: true,
    coordinates: {
      lat: 3.8636,
      lng: 11.5153,
    },
    images: [
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800',
    ],
    specialties: ['Service Rapide', 'Menu Business', 'Espace Réunion'],
    socialMedia: {
      facebook: 'delicemoderne.bonanjo',
      linkedin: 'company/delicemoderne-bonanjo',
    },
    website: 'https://delicemoderne.cm/bonanjo',
    rating: 4.6,
  },
  {
    id: 'akwa',
    name: 'Le Délice Moderne - Akwa',
    address: 'Boulevard de la Liberté, face à la Gare Centrale, Yaoundé',
    phone: '+237 6 99 88 77 66',
    email: 'akwa@delicemoderne.cm',
    hours: 'Lun-Dim: 07h00 - 23h00',
    description:
      'Notre établissement le plus animé, idéal pour découvrir la cuisine de rue camerounaise réinventée.',
    fullDescription:
      "Situé dans le quartier animé d'Akwa, ce restaurant vous propose une expérience culinaire unique inspirée des saveurs de la rue camerounaise, mais revisitée avec des techniques de cuisine moderne. Notre espace ouvert et convivial est parfait pour des repas décontractés entre amis ou en famille.",
    capacity: 150,
    terrace: 50,
    parking: false,
    accessible: true,
    coordinates: {
      lat: 3.8575,
      lng: 11.5189,
    },
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1519709042477-8de6eaf1fdc5?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1504674900247-087703934569?auto=format&fit=crop&w=800',
    ],
    specialties: [
      'Brochettes',
      'Soja',
      'Cuisine de Rue Revisitée',
      'Ambiance Live',
    ],
    socialMedia: {
      facebook: 'delicemoderne.akwa',
      instagram: 'delicemoderne_akwa',
      tiktok: '@delicemoderne_akwa',
    },
    website: 'https://delicemoderne.cm/akwa',
    rating: 4.7,
    events: [
      {
        title: 'Soirée Live Music',
        date: '2023-12-15',
        description: 'Venez profiter d\'une soirée musicale avec des artistes locaux tous les vendredis soirs.'
      },
      {
        title: 'Happy Hours',
        date: '2023-12-16',
        description: 'Profitez de nos Happy Hours de 17h à 19h avec des réductions sur les boissons.'
      },
      {
        title: 'Soirée à Thème',
        date: '2023-12-20',
        description: 'Chaque mois, nous organisons une soirée spéciale avec un thème différent. Consultez notre site pour plus de détails.'
      }
    ],
  },
]
