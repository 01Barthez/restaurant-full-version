import React from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

type ModernTimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export const ModernTimeline: React.FC<ModernTimelineProps> = ({ items, className }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Ligne verticale */}
      <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-restaurant-orange to-restaurant-gold -translate-x-1/2 hidden md:block" />
      
      <motion.div 
        className="space-y-16 md:space-y-24"
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {items.map((event, index) => {
          const Icon = event.icon;
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={event.year}
              variants={item}
              className={cn(
                'relative group',
                'md:grid md:grid-cols-2 md:gap-12',
                'items-center',
                isEven ? 'md:text-right' : 'md:text-left',
                'px-4 md:px-0'
              )}
            >
              {/* Côté gauche (année) - visible sur mobile et desktop */}
              <div 
                className={cn(
                  'flex items-center justify-center md:justify-end mb-4 md:mb-0',
                  !isEven && 'md:order-2 md:justify-start'
                )}
              >
                <div className="relative">
                  {/* Cercle de fond animé */}
                  <div className="absolute inset-0 rounded-full bg-restaurant-orange/20 scale-0 group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Cercle principal */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-restaurant-gradient flex items-center justify-center text-white text-xl font-bold">
                    {event.year}
                  </div>
                  
                  {/* Icône flottante */}
                  <div className="absolute -bottom-3 -right-3 z-50 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
                    <Icon className="w-5 h-5 text-restaurant-orange" />
                  </div>
                </div>
              </div>

              {/* Côté droit (contenu) - visible sur mobile et desktop */}
              <div 
                className={cn(
                  'relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700',
                  'transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl',
                  'before:absolute before:top-[30px] before:-translate-y-[25px] before:w-4 before:h-4 before:bg-restaurant-orange before:rotate-45',
                  'md:before:block md:before:absolute md:before:top-1/2 md:before:-translate-y-1/2 md:before:w-4 md:before:h-4 md:before:rotate-45 md:before:bg-white md:dark:bg-gray-800',
                  isEven 
                    ? 'md:before:-right-2 md:before:border-t md:before:border-r md:before:border-gray-200 md:dark:border-gray-700' 
                    : 'md:before:-left-2 md:before:border-b md:before:border-l md:before:border-gray-200 md:dark:border-gray-700',
                  isEven ? 'md:mr-8' : 'md:ml-8 md:order-1',
                  'mt-8 md:mt-0'
                )}
              >
                <h3 className="text-xl font-bold text-restaurant-dark dark:text-white mb-2">
                  {event.title}
                </h3>

                <p className="para text-gray-600 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
                
                {/* Ligne de connexion pour mobile */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-transparent to-restaurant-orange md:hidden" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ModernTimeline;
