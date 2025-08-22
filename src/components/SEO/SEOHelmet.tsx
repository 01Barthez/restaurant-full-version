
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
  canonicalUrl?: string;
  noIndex?: boolean;
  locale?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title = "Le Délice Moderne - Restaurant Camerounais",
  description = "Découvrez Le Délice Moderne, votre restaurant camerounais authentique. Commandez en ligne nos plats traditionnels, réservez votre table et profitez de la livraison à domicile.",
  keywords = "restaurant camerounais, cuisine africaine, plats traditionnels, livraison yaoundé, réservation restaurant, orange money, mtn money, fcfa, cameroun",
  image = "/placeholder.svg",
  url,
  type = "website",
  author = "Le Délice Moderne",
  publishedTime,
  modifiedTime,
  structuredData,
  canonicalUrl,
  noIndex = false,
  locale = "fr_CM"
}) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonical = canonicalUrl || currentUrl;
  const fullTitle = title.includes("Le Délice Moderne") ? title : `${title} | Le Délice Moderne`;
  const fullImageUrl = image.startsWith('http') ? image : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`;

  // Structure de données par défaut pour un restaurant
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Le Délice Moderne",
    "description": description,
    "url": canonical,
    "image": fullImageUrl,
    "logo": fullImageUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenue de l'Indépendance",
      "addressLocality": "Yaoundé",
      "addressRegion": "Centre",
      "postalCode": "00237",
      "addressCountry": "CM"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "3.8480",
      "longitude": "11.5021"
    },
    "telephone": "+237 6 XX XX XX XX",
    "email": "contact@ledelicemoderne.cm",
    "openingHours": [
      "Mo-Su 10:00-22:00"
    ],
    "priceRange": "FCFA 2000-15000",
    "servesCuisine": ["Camerounaise", "Africaine", "Traditionnelle"],
    "acceptsReservations": true,
    "paymentAccepted": ["Cash", "Orange Money", "MTN Money", "Virement bancaire"],
    "currenciesAccepted": "XAF",
    "hasMenu": {
      "@type": "Menu",
      "name": "Menu Principal",
      "description": "Découvrez notre sélection de plats camerounais authentiques"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Livraison à domicile",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Commande en ligne",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Paiement mobile",
        "value": true
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Balises de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Géolocalisation pour le Cameroun */}
      <meta name="geo.region" content="CM-CE" />
      <meta name="geo.placename" content="Yaoundé" />
      <meta name="geo.position" content="3.8480;11.5021" />
      <meta name="ICBM" content="3.8480, 11.5021" />
      
      {/* Open Graph optimisé */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Le Délice Moderne" />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="en_CM" />
      
      {/* Twitter Cards optimisé */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@ledelicemoderne" />
      <meta name="twitter:creator" content="@ledelicemoderne" />
      
      {/* Article meta pour le contenu */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* PWA et mobile */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Le Délice Moderne" />
      
      {/* Preload critiques pour la performance */}
      <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" as="image" href={fullImageUrl} />
      
      {/* DNS Prefetch pour les performances */}
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preconnect pour les ressources critiques */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Alternates pour les langues */}
      <link rel="alternate" hrefLang="fr" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical.replace('fr/', 'en/')} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      
      {/* Favicon optimisé */}
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>" type="image/svg+xml" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHelmet;
