import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { 
  RiHome5Line,
  RiLineChartLine,
  RiTrophyLine,
  RiNewspaperLine,
  RiToolsLine
} from 'react-icons/ri';
import Image from 'next/image';

interface HubMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    icon: RiHome5Line,
    label: 'Home',
    href: '/dashboard',
    isActive: true,
    isComingSoon: false 
  },
  { 
    icon: RiLineChartLine,
    label: 'Strategies',
    href: '/strategies',
    isComingSoon: false 
  },
  { 
    icon: RiTrophyLine,
    label: 'Leaderboard',
    href: '/leaderboard',
    isComingSoon: false 
  },
  { 
    icon: RiNewspaperLine,
    label: 'Feed',
    href: '/feed',
    isComingSoon: true 
  },
  { 
    icon: RiToolsLine,
    label: 'Tools',
    href: '/tools',
    isComingSoon: true 
  }
];

export default function HubMenu({ isOpen, onClose }: HubMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-4">
              <h1 className="text-[32px] font-bold text-white">
                Hub
              </h1>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <IoClose size={24} className="text-white" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.isComingSoon ? '#' : item.href}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl
                      transition-all duration-200
                      ${item.isActive 
                        ? 'bg-[#7B61FF]/10 text-[#7B61FF]' 
                        : 'bg-[#121212] text-white hover:bg-[#151515]'}
                      ${item.isComingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    whileHover={!item.isComingSoon ? { scale: 1.02 } : undefined}
                    whileTap={!item.isComingSoon ? { scale: 0.98 } : undefined}
                  >
                    <item.icon 
                      size={24} 
                      className="mb-1"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-medium">
                      {item.label}
                      {item.isComingSoon && (
                        <span className="block text-xs opacity-75 mt-0.5">
                          Coming Soon
                        </span>
                      )}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-8">
              <div className="flex items-center justify-center gap-8">
                <Image
                  src="/adq-logo.svg"
                  alt="ADQ"
                  width={40}
                  height={20}
                  className="text-white/50"
                />
                <Image
                  src="/adh-logo.svg"
                  alt="ADH"
                  width={40}
                  height={20}
                  className="text-white/50"
                />
                <Image
                  src="/e&-logo.svg"
                  alt="e&"
                  width={40}
                  height={20}
                  className="text-white/50"
                />
                <Image
                  src="/fab-logo.svg"
                  alt="FAB"
                  width={40}
                  height={20}
                  className="text-white/50"
                />
              </div>
            </div>

            {/* Close Button */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <motion.button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-[#7B61FF] flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoClose size={24} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 