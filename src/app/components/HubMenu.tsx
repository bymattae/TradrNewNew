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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
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
            <div className="relative flex items-center justify-center px-6 py-8 border-b border-white/10">
              <h1 className="text-2xl font-bold tracking-tight text-white">Tradr Hub</h1>
              <button
                onClick={onClose}
                className="absolute right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <IoClose size={24} className="text-white" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl 
                      transition-all duration-200 ease-out
                      border border-white/10
                      ${item.isComingSoon 
                        ? 'opacity-60 cursor-not-allowed bg-white/5' 
                        : 'bg-white/10 hover:bg-white/[0.15] hover:scale-[1.02] hover:shadow-lg'}`}
                  >
                    <item.icon 
                      size={28} 
                      className={`${item.isComingSoon ? 'text-white/60' : 'text-white'}`} 
                    />
                    <span className={`text-base font-medium text-center
                      ${item.isComingSoon ? 'text-white/60' : 'text-white'}`}>
                      {item.label}
                    </span>
                    {item.isComingSoon && (
                      <span className="text-xs text-white/40 mt-1">
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