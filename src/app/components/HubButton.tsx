import { motion } from 'framer-motion';
import { RiApps2Line } from 'react-icons/ri';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <div className="fixed bottom-8 left-8 z-50">
      <motion.button
        onClick={onClick}
        className="relative group"
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-[#7B61FF]/20 blur-xl 
          group-hover:bg-[#7B61FF]/30 transition-all duration-300" />
        
        {/* Button */}
        <div className="relative p-3.5 rounded-xl
          bg-gradient-to-b from-white/10 to-white/5
          hover:from-white/15 hover:to-white/10
          border border-white/10 backdrop-blur-md
          shadow-[0_8px_16px_rgba(0,0,0,0.5)]
          transition-all duration-300">
          <RiApps2Line className="w-6 h-6 text-white/90" />
        </div>
      </motion.button>
    </div>
  );
}