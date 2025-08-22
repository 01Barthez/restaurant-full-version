# Mise à jour des Hero Sections

Ce document explique comment mettre à jour chaque page avec le nouveau composant `HeroSection`.

## Structure de base

```tsx
import HeroSection from '@/components/common/HeroSection';
import { HERO_CONTENT } from '@/constants/heroSections';

// Dans votre composant de page :
<HeroSection 
  image="NOM_DE_L'IMAGE"
  span={HERO_CONTENT.PAGE_NAME.span}
  title={HERO_CONTENT.PAGE_NAME.title}
  description={HERO_CONTENT.PAGE_NAME.description}
/>
```

## Pages à mettre à jour

### 1. Restaurant Detail (`/restaurant/:id`)

```tsx
<HeroSection 
  image="RESTAURANT"
  span={HERO_CONTENT.RESTAURANT.span}
  title={HERO_CONTENT.RESTAURANT.title}
  description={HERO_CONTENT.RESTAURANT.description}
/>
```

### 2. Menu (`/menu`)

```tsx
<HeroSection 
  image="MENU"
  span={HERO_CONTENT.MENU.span}
  title={HERO_CONTENT.MENU.title}
  description={HERO_CONTENT.MENU.description}
/>
```

### 3. Menu Detail (`/menu/:id`)

```tsx
<HeroSection 
  image="MENU_DETAIL"
  span={HERO_CONTENT.MENU_DETAIL.span}
  title={HERO_CONTENT.MENU_DETAIL.title}
  description={HERO_CONTENT.MENU_DETAIL.description}
/>
```

### 4. About (`/about`)

```tsx
<HeroSection 
  image="ABOUT"
  span={HERO_CONTENT.ABOUT.span}
  title={HERO_CONTENT.ABOUT.title}
  description={HERO_CONTENT.ABOUT.description}
/>
```

### 5. About Startup (`/about-startup`)

```tsx
<HeroSection 
  image="ABOUT_STARTUP"
  span={HERO_CONTENT.ABOUT_STARTUP.span}
  title={HERO_CONTENT.ABOUT_STARTUP.title}
  description={HERO_CONTENT.ABOUT_STARTUP.description}
/>
```

### 6. Gallery (`/gallery`)

```tsx
<HeroSection 
  image="GALLERY"
  span={HERO_CONTENT.GALLERY.span}
  title={HERO_CONTENT.GALLERY.title}
  description={HERO_CONTENT.GALLERY.description}
/>
```

### 7. Special Offer (`/special-offer/:id`)

```tsx
<HeroSection 
  image="SPECIAL_OFFER"
  span={HERO_CONTENT.SPECIAL_OFFER.span}
  title={HERO_CONTENT.SPECIAL_OFFER.title}
  description={HERO_CONTENT.SPECIAL_OFFER.description}
/>
```

### 8. About Rewards (`/about-rewards`)

```tsx
<HeroSection 
  image="ABOUT_REWARDS"
  span={HERO_CONTENT.ABOUT_REWARDS.span}
  title={HERO_CONTENT.ABOUT_REWARDS.title}
  description={HERO_CONTENT.ABOUT_REWARDS.description}
/>
```

## Personnalisation des pages spécifiques

### 404 Not Found (`/404`)

```tsx
<HeroSection 
  image="NOT_FOUND"
  span="Oups !"
  title="Page introuvable"
  description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
  className="min-h-[60vh] flex items-center"
>
  <Link 
    to="/" 
    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600"
  >
    Retour à l'accueil
  </Link>
</HeroSection>
```

### Tableau de bord Admin (`/admin/dashboard`)

```tsx
<HeroSection 
  image="ADMIN_DASHBOARD"
  span="Tableau de bord"
  title="Bienvenue dans l'administration"
  description="Gérez votre restaurant en toute simplicité"
  className="bg-opacity-90"
/>
```

### Profil Utilisateur (`/user/:id`)

```tsx
<HeroSection 
  image="USER_PROFILE"
  span="Mon espace personnel"
  title={`Bonjour, ${userName}`}
  description="Gérez vos réservations et préférences"
  className="pt-24 pb-12"
/>
```

### Commandes Utilisateur (`/user/admin-user/orders`)

```tsx
<HeroSection 
  image="USER_PROFILE"
  span="Historique"
  title="Mes commandes"
  description="Retrouvez l'historique complet de vos commandes passées"
  className="pt-24 pb-12"
/>
```

### Paramètres Utilisateur (`/user/admin-user/settings`)

```tsx
<HeroSection 
  image="USER_PROFILE"
  span="Paramètres"
  title="Préférences du compte"
  description="Personnalisez votre expérience utilisateur"
  className="pt-24 pb-12"
/>
```

## Personnalisation avancée

Le composant `HeroSection` accepte également des enfants et des classes personnalisées :

```tsx
<HeroSection 
  image="CUSTOM_IMAGE"
  span="Personnalisé"
  title="Titre personnalisé"
  description="Description personnalisée"
  className="custom-classes-here"
>
  {/* Boutons ou contenu supplémentaire */}
  <div className="mt-6 space-x-4">
    <button className="btn btn-primary">Action 1</button>
    <button className="btn btn-secondary">Action 2</button>
  </div>
</HeroSection>
```
