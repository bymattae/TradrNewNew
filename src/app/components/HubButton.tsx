import { motion } from 'framer-motion';
import { HiViewGrid } from 'react-icons/hi';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <div className="fixed bottom-8 left-8 z-30">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-[#7B61FF]/20 rounded-full blur-xl" />
      
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative animate-float
          bg-[#7B61FF] hover:bg-[#8B74FF]
          text-white rounded-full p-5
          shadow-[0_8px_16px_rgba(123,97,255,0.3)]
          hover:shadow-[0_12px_24px_rgba(123,97,255,0.4)]
          backdrop-blur-sm
          transition-all duration-300 ease-out
          flex items-center justify-center"
      >
        <HiViewGrid size={24} className="text-white" />
      </motion.button>
    </div>
  );
}