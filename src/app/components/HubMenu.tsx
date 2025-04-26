import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { 
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineStar,
  HiOutlineNewspaper,
  HiOutlineCube
} from 'react-icons/hi';

interface HubMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    icon: HiOutlineUser, 
    label: 'My Tradr', 
    href: '/profile',
    isComingSoon: false 
  },
  { 
    icon: HiOutlineChartBar, 
    label: 'Strategies', 
    href: '/strategies',
    isComingSoon: false 
  },
  { 
    icon: HiOutlineStar, 
    label: 'Leaderboard', 
    href: '/leaderboard',
    isComingSoon: false 
  },
  { 
    icon: HiOutlineNewspaper, 
    label: 'Feed', 
    href: '/feed',
    isComingSoon: true 
  },
  { 
    icon: HiOutlineCube, 
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-gray-950 flex flex-col"
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-6 py-6 border-b border-white/10">
              <h1 className="text-xl font-bold text-white">Tradr Hub</h1>
              <button
                onClick={onClose}
                className="absolute right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <IoClose size={24} className="text-white" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-colors
                      ${item.isComingSoon 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:bg-white/5'}`}
                  >
                    <item.icon size={24} className="text-white" />
                    <span className="text-base font-medium text-white">
                      {item.label}
                    </span>
                    {item.isComingSoon && (
                      <span className="ml-auto text-sm text-white/60">
                        Coming Soon
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 