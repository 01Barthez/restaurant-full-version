    import { ChefHat, Clock, Star, Users } from 'lucide-react'

    export const features = [
        {
            title: "Cuisine d'Auteur",
            desc: 'Créations uniques signées par nos chefs étoilés',
            icon: <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
            tile: 'from-amber-300 to-yellow-500 text-slate-900',
        },
        {
            title: "Produits d'Exception",
            desc: 'Ingrédients nobles et terroir français',
            icon: <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />,
            tile: 'from-blue-500 to-violet-600 text-white',
        },
        {
            title: 'Service Irréprochable',
            desc: 'Excellence à chaque instant',
            icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />,
            tile: 'from-emerald-500 to-green-600 text-white',
        },
        {
            title: 'Expérience Unique',
            desc: "Moments d'exception en famille ou entre amis",
            icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />,
            tile: 'from-rose-500 to-pink-600 text-white',
        },
    ]
