import React from 'react';
import OptimizedLazyImage from '@/components/ui/OptimizedLazyImage';
import getDefaultImages from '../functions/getDefaultImages';
import { FlowerDishClusterProps } from '@/types/global';
import { PETAL_POSITIONS } from '@/constants/global';

const FlowerDishCluster: React.FC<FlowerDishClusterProps> = ({ images, className }) => {
  const imgs = (images && images.length ? images : getDefaultImages(7)).slice(0, 7);

  return (
    <div className={['relative', 'w-[280px] h-[280px]', 'sm:w-[340px] sm:h-[340px]', 'md:w-[400px] md:h-[400px]', 'lg:w-[480px] lg:h-[480px]', className].join(' ')}>
      {/* Center circle */}
      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-2 ring-restaurant-gold/60 shadow-inner z-20">
        <OptimizedLazyImage
          src={imgs[0]}
          alt="Plat signature"
          className="w-full h-full"
          imgClassName="object-cover"
          priority
        />
      </div>

      {/* Petals */}
      {PETAL_POSITIONS.map((deg, idx) => {
        const angle = (deg * Math.PI) / 180;
        // Single base radius for positioning (smaller radius to create overlap emphasis)
        const radius = 110; // px
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const style: React.CSSProperties = {
          transform: `translate(calc(-50% + ${x * radius}px), calc(-50% + ${y * radius}px))`,
        };

        const petalImg = imgs[(idx + 1) % imgs.length];

        return (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            style={style}
          >
            <div
              className="relative rounded-[48%] overflow-hidden ring-2 ring-restaurant-orange/50 shadow-lg bg-white/5 backdrop-blur-sm
                         w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
                         hover:scale-105 transition-transform duration-300"
            >
              <OptimizedLazyImage
                src={petalImg}
                alt={`Plat ${idx + 1}`}
                className="w-full h-full"
                imgClassName="object-cover"
              />
              {/* Soft gradient highlight */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlowerDishCluster;
