import { Star, Gift, Trophy, Clock, Euro, Users, Calendar } from 'lucide-react';

export const pointsRules = [
    {
        icon: Euro,
        title: "Points de base",
        description: "Gagnez 1 point pour chaque euro dépensé sur votre commande",
        points: "1 point/€"
    },
    {
        icon: Gift,
        title: "Bonus grandes commandes",
        description: "Commandes de 50€+ : +5 points | 100€+ : +20 points | 200€+ : +50 points",
        points: "Jusqu'à +50"
    },
    {
        icon: Calendar,
        title: "Bonus fidélité mensuelle",
        description: "Commandez au moins 4 fois par mois et gagnez un bonus de 25 points",
        points: "+25 points"
    },
    {
        icon: Users,
        title: "Parrainage",
        description: "Parrainez un ami et gagnez 100 points quand il passe sa première commande",
        points: "+100 points"
    },
    {
        icon: Trophy,
        title: "Anniversaire du compte",
        description: "Recevez un bonus spécial chaque année pour l'anniversaire de votre inscription",
        points: "+50 points"
    },
    {
        icon: Clock,
        title: "Bonus ancienneté",
        description: "Plus vous êtes fidèle, plus vous gagnez : +10% de points après 6 mois, +20% après 1 an",
        points: "+10% à +20%"
    }
];