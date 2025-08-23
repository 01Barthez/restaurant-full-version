
import { MenuItem } from '@/types/global';


export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Ndolé",
    description: "Plat traditionnel camerounais aux arachides et légumes verts, accompagné de viande de bœuf et crevettes séchées",
    price: 2500,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 45,
    ingredients: ["Feuilles de ndolé", "Arachides", "Bœuf", "Crevettes séchées", "Stockfish", "Huile de palme"],
    available: true,
    featured: true
  },
  {
    id: "2",
    name: "Poulet DG",
    description: "Morceaux de poulet sautés avec plantains mûrs et légumes, dans une sauce savoureuse",
    price: 3000,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 35,
    ingredients: ["Poulet", "Plantains mûrs", "Carottes", "Haricots verts", "Poivrons", "Oignons"],
    available: true,
    featured: true
  },
  {
    id: "3",
    name: "Eru",
    description: "Légumes verts traditionnels avec stockfish, viande fumée et crevettes dans une sauce onctueuse",
    price: 2200,
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 40,
    ingredients: ["Feuilles d'eru", "Stockfish", "Viande fumée", "Crevettes", "Huile de palme", "Baton de manioc"],
    available: true,
    featured: true
  },
  {
    id: "4",
    name: "Koki de haricots",
    description: "Gâteau traditionnel de haricots blancs cuit à la vapeur dans des feuilles de bananier",
    price: 1500,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 60,
    ingredients: ["Haricots blancs", "Huile de palme", "Oignons", "Piment", "Sel", "Feuilles de bananier"],
    available: true,
    featured: false
  },
  {
    id: "5",
    name: "Poisson braisé",
    description: "Poisson frais grillé aux épices camerounaises, accompagné d'attiéké",
    price: 2800,
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 25,
    ingredients: ["Poisson frais", "Attiéké", "Tomates", "Oignons", "Piment", "Épices"],
    available: true,
    featured: true
  },
  {
    id: "6",
    name: "Riz sauté aux crevettes",
    description: "Riz parfumé sauté avec crevettes fraîches et légumes colorés",
    price: 2000,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 20,
    ingredients: ["Riz", "Crevettes", "Carottes", "Petits pois", "Oignons", "Ail"],
    available: true,
    featured: false
  },
  {
    id: "7",
    name: "Fufu de plantain",
    description: "Accompagnement traditionnel à base de plantains bouillis et pilés",
    price: 800,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop",
    category: "supplements",
    preparationTime: 30,
    ingredients: ["Plantains", "Sel"],
    available: true,
    featured: false
  },
  {
    id: "8",
    name: "Eau minérale",
    description: "Eau minérale naturelle rafraîchissante",
    price: 500,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop",
    category: "boissons",
    preparationTime: 1,
    ingredients: ["Eau minérale"],
    available: true,
    featured: false
  },
  {
    id: "9",
    name: "Jus de gingembre",
    description: "Boisson traditionnelle rafraîchissante au gingembre frais",
    price: 800,
    image: "https://images.unsplash.com/photo-1589993603446-a7db80d68dbc?w=500&h=400&fit=crop",
    category: "boissons",
    preparationTime: 5,
    ingredients: ["Gingembre frais", "Citron", "Sucre", "Eau"],
    available: true,
    featured: true
  },
  {
    id: "10",
    name: "Bissap",
    description: "Infusion d'hibiscus avec gingembre et menthe, boisson rafraîchissante",
    price: 700,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=400&fit=crop",
    category: "boissons",
    preparationTime: 5,
    ingredients: ["Fleurs d'hibiscus", "Gingembre", "Menthe", "Sucre"],
    available: true,
    featured: true
  },
  {
    id: "11",
    name: "Beignets haricots",
    description: "Beignets croustillants aux haricots noirs, parfaits pour l'apéritif",
    price: 1200,
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 15,
    ingredients: ["Haricots noirs", "Oignons", "Piment", "Farine", "Huile"],
    available: true,
    featured: false
  },
  {
    id: "12",
    name: "Salade de plantains",
    description: "Salade fraîche de plantains avec tomates, oignons et vinaigrette",
    price: 1000,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop",
    category: "plats",
    preparationTime: 10,
    ingredients: ["Plantains", "Tomates", "Oignons", "Huile d'olive", "Vinaigre"],
    available: true,
    featured: false
  }
];
