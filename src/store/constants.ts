
export const RESTAURANT_COORDINATES = {
  latitude: 48.8566,
  longitude: 2.3522
};

export const LOCATION_RADIUS_METERS = 100;

export const DEMO_DATA_IDS = {
  DEMO_USER: 'demo-user-001',
  ORDER_PREFIX: 'order-demo-',
  MESSAGE_PREFIX: 'msg-',
  LOG_PREFIX: 'log-'
};

export const contact_data = {
  phone: "+237 655 646 688",
  email: "kenwoubarthez@gmail.com",
  location: "Odza - Yaounde, Cameroun",
  open_hours: "Lun-Dim: 10h00 - 22h00"
} as const;

export const social_data = {
  facebook: "#",
  instagram: "#",
  twitter: "#"
} as const;

export const redeemOptions = [
  { points: 100, reward: "Café offert", description: "Un café de notre sélection premium" },
  { points: 200, reward: "Dessert gratuit", description: "Un dessert de votre choix" },
  { points: 500, reward: "Réduction 10€", description: "10€ de réduction sur votre prochaine commande" },
  { points: 1000, reward: "Menu complet gratuit", description: "Un menu complet de votre choix" },
  { points: 2000, reward: "Soirée dégustation", description: "Invitation pour 2 personnes à notre soirée dégustation mensuelle" },
];
