import { motion } from 'framer-motion';
import { IoGridOutline } from 'react-icons/io5';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.button
        onClick={onClick}
        className="relative p-3.5 rounded-full bg-[#7B61FF] hover:bg-[#8B74FF] transition-colors shadow-[0_4px_20px_rgba(123,97,255,0.5)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -5, 0] }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <IoGridOutline className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}