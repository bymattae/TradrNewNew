import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { 
  HiHome,
  HiChartBar,
  HiTrophy,
  HiNewspaper,
  HiCube,
} from 'react-icons/hi2';

interface HubMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    icon: HiHome, 
    label: 'My Tradr', 
    href: '/profile',
    isComingSoon: false 
  },
  { 
    icon: HiChartBar, 
    label: 'Strategies', 
    href: '/strategies',
    isComingSoon: false 
  },
  { 
    icon: HiTrophy, 
    label: 'Leaderboard', 
    href: '/leaderboard',
    isComingSoon: false 
  },
  { 
    icon: HiNewspaper, 
    label: 'Feed', 
    href: '/feed',
    isComingSoon: true 
  },
  { 
    icon: HiCube, 
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
            className="fixed inset-0 z-50 bg-gradient-to-b from-[#0D0D0D] to-[#151515] flex flex-col"
          >
            {/* Header */}
            <div className="relative flex flex-col items-center justify-center px-6 py-8">
              <h1 className="text-[20px] font-bold tracking-tight text-white">
                Tradr Hub
              </h1>
              <div className="absolute w-16 h-[1px] bg-white/10 bottom-0" />
              <button
                onClick={onClose}
                className="absolute right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <IoClose size={24} className="text-white" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 px-8 py-12 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.isComingSoon ? '#' : item.href}
                    className={`
                      flex flex-col items-center justify-center gap-8 py-8 px-4 rounded-xl
                      transition-all duration-200 ease-out
                      bg-[#1A1A1A]
                      shadow-[0px_4px_12px_rgba(0,0,0,0.3)]
                      ${item.isComingSoon 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:shadow-[0px_4px_12px_rgba(0,0,0,0.3),0px_0px_0px_1px_#7B61FF]'
                      }
                    `}
                    whileHover={!item.isComingSoon ? { scale: 1.02 } : undefined}
                    whileTap={!item.isComingSoon ? { scale: 1.05 } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <item.icon 
                      size={36} 
                      className={`${item.isComingSoon ? 'text-[#AAAAAA]' : 'text-white'}`}
                      strokeWidth={2}
                    />
                    <span className={`
                      text-[15px] font-semibold text-center
                      ${item.isComingSoon ? 'text-[#AAAAAA]' : 'text-white'}
                    `}>
                      {item.label}
                    </span>
                    {item.isComingSoon && (
                      <span className="text-xs text-[#AAAAAA] mt-1 font-medium">
                        Coming Soon
                      </span>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 