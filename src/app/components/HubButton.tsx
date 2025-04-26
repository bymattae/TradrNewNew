import { motion } from 'framer-motion';
import { HiViewGrid } from 'react-icons/hi';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="fixed bottom-8 left-8 z-30 
        bg-[#7B61FF] hover:bg-[#8B74FF]
        text-white rounded-full p-5
        shadow-[0_6px_12px_rgba(123,97,255,0.4)]
        hover:shadow-[0_8px_16px_rgba(123,97,255,0.5)]
        backdrop-blur-sm
        transition-all duration-200 ease-out
        flex items-center justify-center"
    >
      <HiViewGrid size={32} className="text-white" />
    </motion.button>
  );
}