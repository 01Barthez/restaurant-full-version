
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';

interface CartAnimationProps {
  triggerAnimation: boolean;
  onAnimationComplete: () => void;
  startPosition?: { x: number; y: number };
}

const CartAnimation: React.FC<CartAnimationProps> = ({
  triggerAnimation,
  onAnimationComplete,
  startPosition = { x: 0, y: 0 }
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnimationComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onAnimationComplete();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {triggerAnimation && (
        <>
          {/* Animation de vol vers le panier */}
          <motion.div
            initial={{
              x: startPosition.x,
              y: startPosition.y,
              scale: 1,
              opacity: 1
            }}
            animate={{
              x: window.innerWidth - 100,
              y: 20,
              scale: 0.3,
              opacity: 0.7
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
            onAnimationComplete={handleAnimationComplete}
            className="fixed z-50 pointer-events-none"
          >
            <div className="bg-orange-500 text-white p-2 rounded-full">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Animation de succès */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed top-20 right-4 z-50 bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Ajouté au panier!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartAnimation;
