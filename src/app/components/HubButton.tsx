import { motion } from 'framer-motion';
import { FaCompass } from 'react-icons/fa';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 
        bg-gradient-to-r from-blue-600 to-indigo-600 
        hover:from-blue-500 hover:to-indigo-500
        text-white rounded-full p-4 shadow-lg shadow-blue-500/20
        transition-all duration-200 ease-out
        flex items-center gap-2"
    >
      <FaCompass size={20} className="text-white" />
      <span className="font-medium">Hub</span>
    </motion.button>
  );
}