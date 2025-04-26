import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { 
  Home,
  BarChart2,
  Trophy,
  Newspaper,
  Boxes
} from 'lucide-react';
import Image from 'next/image';

interface HubMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    icon: Home, 
    label: 'My Tradr', 
    href: '/profile',
    isComingSoon: false 
  },
  { 
    icon: BarChart2, 
    label: 'Strategies', 
    href: '/strategies',
    isComingSoon: false 
  },
  { 
    icon: Trophy, 
    label: 'Leaderboard', 
    href: '/leaderboard',
    isComingSoon: false 
  },
  { 
    icon: Newspaper, 
    label: 'Feed', 
    href: '/feed',
    isComingSoon: true 
  },
  { 
    icon: Boxes, 
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
              <h1 className="text-[24px] font-bold tracking-tight text-white mb-6">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.isComingSoon ? '#' : item.href}
                    className={`
                      flex flex-col items-center justify-center gap-6 py-8 px-4 rounded-2xl
                      transition-all duration-300 ease-out
                      bg-[#121212] hover:bg-[#151515]
                      shadow-[0px_6px_16px_rgba(0,0,0,0.5)]
                      ${item.isComingSoon 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:shadow-[0px_8px_20px_rgba(0,0,0,0.6),0px_0px_0px_1px_rgba(123,97,255,0.3)]'
                      }
                    `}
                    whileHover={!item.isComingSoon ? { 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    } : undefined}
                    whileTap={!item.isComingSoon ? { scale: 0.98 } : undefined}
                  >
                    <item.icon 
                      size={28} 
                      className={`${item.isComingSoon ? 'text-[#AAAAAA]' : 'text-white'}`}
                      strokeWidth={1.5}
                    />
                    <span className={`
                      text-[15px] font-medium text-center
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

            {/* Footer */}
            <div className="px-8 py-6 flex justify-center">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <div className="relative w-5 h-5">
                  <Image
                    src="https://rnfvzaelmwbbvfbsppir.supabase.co/storage/v1/object/public/assets/TradrIcon%20(1).png"
                    alt="Tradr"
                    fill
                    sizes="20px"
                    className="object-contain"
                  />
                </div>
                <span>Powered by</span>
                <span className="font-medium">Tradr</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 