import { motion } from 'framer-motion';
import { HiViewGrid } from 'react-icons/hi';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 left-[22%] -translate-x-1/2 z-30 
        bg-gradient-to-r from-indigo-600 to-indigo-700
        hover:from-indigo-500 hover:to-indigo-600
        text-white rounded-full p-4 
        shadow-[0_8px_16px_-4px_rgba(99,102,241,0.5)] 
        hover:shadow-[0_12px_20px_-4px_rgba(99,102,241,0.6)]
        backdrop-blur-sm
        transition-all duration-200 ease-out
        flex items-center justify-center"
    >
      <HiViewGrid size={24} className="text-white" />
    </motion.button>
  );
}