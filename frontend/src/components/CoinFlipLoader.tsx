import { motion } from 'motion/react';
import { Landmark } from 'lucide-react';

export default function CoinFlipLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/80 backdrop-blur-sm">
      <motion.div
        className="relative w-20 h-20"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of the coin */}
        <div className="absolute inset-0 flex items-center justify-center bg-primary rounded-full shadow-lg border-4 border-primary-container backface-hidden">
          <Landmark className="w-10 h-10 text-on-primary" />
        </div>
        {/* Back of the coin */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-secondary rounded-full shadow-lg border-4 border-secondary-container backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <Landmark className="w-10 h-10 text-on-secondary" />
        </div>
      </motion.div>
    </div>
  );
}
