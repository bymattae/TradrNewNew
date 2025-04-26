import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { 
  RiHome5Line,
  RiLineChartLine,
  RiTrophyLine,
} from 'react-icons/ri';
import { 
  RssIcon,
  Wrench
} from 'lucide-react';
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
  }
];

const comingSoonItems = [
  {
    icon: RssIcon,
    label: 'Feed',
    href: '/feed',
    isComingSoon: true
  },
  {
    icon: Wrench,
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
            className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-[var(--divider)]">
              <h1 className="text-[32px] font-bold text-[var(--text-primary)]">
                Tradr Hub
              </h1>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--button-background)] transition-colors"
              >
                <IoClose size={24} className="text-[var(--text-primary)]" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              {/* Main Menu Items */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl
                      transition-all duration-200 border
                      ${item.isActive 
                        ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20 shadow-[0_4px_12px_rgba(123,79,255,0.15)]' 
                        : 'bg-[var(--card-background)] text-[var(--text-primary)] border-[var(--divider)] hover:bg-[var(--button-background)] hover:border-[rgba(123,79,255,0.2)]'}
                      cursor-pointer
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon 
                      size={24} 
                      className={`mb-1 ${item.isActive ? 'drop-shadow-[0_0_4px_rgba(123,79,255,0.3)]' : ''}`}
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Coming Soon Items */}
              <div className="flex justify-center gap-3">
                {comingSoonItems.map((item) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl
                      bg-[var(--button-background)] text-[var(--text-secondary)] opacity-60 cursor-not-allowed
                      transition-all duration-200 w-[160px] border border-[var(--divider)]
                      shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]"
                  >
                    <item.icon 
                      size={24} 
                      className="mb-1"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-medium">
                      {item.label}
                      <span className="block text-xs mt-0.5">
                        Coming Soon
                      </span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-8 border-t border-[var(--divider)]">
              <div className="flex items-center justify-center gap-8">
                <Image
                  src="/adq-logo.svg"
                  alt="ADQ"
                  width={40}
                  height={20}
                  className="opacity-50 hover:opacity-70 transition-opacity"
                />
                <Image
                  src="/adh-logo.svg"
                  alt="ADH"
                  width={40}
                  height={20}
                  className="opacity-50 hover:opacity-70 transition-opacity"
                />
                <Image
                  src="/e&-logo.svg"
                  alt="e&"
                  width={40}
                  height={20}
                  className="opacity-50 hover:opacity-70 transition-opacity"
                />
                <Image
                  src="/fab-logo.svg"
                  alt="FAB"
                  width={40}
                  height={20}
                  className="opacity-50 hover:opacity-70 transition-opacity"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 