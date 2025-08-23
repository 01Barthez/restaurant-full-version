
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/data/categories.data';
import { CategorySectionProps } from '@/types/global';

const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect }) => {
  return (
    <section className="py-16 px-4 bg-background mx-10 lg:mx-0">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="title text-restaurant-dark mb-4">
            Explorez Nos Catégories
          </h2>
          <p className="para text-gray-600 dark:text-gray-300 text-lg">
            Découvrez notre large gamme de plats organisés par catégories
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="relative cursor-pointer group animate-fade-in overflow-hidden flex-col items-center justify-center whitespace-nowrap text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-800 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:bg-restaurant-cream hover:ring-2 hover:ring-[hsl(var(--restaurant-primary))] dark:hover:ring-[hsl(var(--restaurant-gold))]"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onCategorySelect(category.id)}
              >
                <CardContent className="p-2 md:p-4 lg:p-6 text-center relative">
                  <div className={`w-12 md:w-14 lg:w-16  h-12 md:h-14 lg:h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-center text-restaurant-dark mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm text-center text-wrap mb-3">
                    {category.description}
                  </p>
                  <div className="text-sm lg:text-base text-restaurant-orange font-semibold">
                    {category.count} articles
                  </div>
                  <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[hsl(var(--restaurant-primary))] dark:bg-[hsl(var(--restaurant-gold))]">
                    Voir tout
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
