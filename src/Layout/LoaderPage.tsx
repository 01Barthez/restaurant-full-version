import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const LoaderPage: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Icon */}
        <motion.div
          className="relative mx-auto w-20 h-20 mb-6"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-500/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Utensils className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground"
        >
          Chargement...
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-4 h-1 w-40 bg-muted rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoaderPage;
