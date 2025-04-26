import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { 
  FaHome,
  FaChartLine,
  FaPaperPlane,
  FaCreditCard,
  FaGem,
  FaPiggyBank,
  FaBullseye,
  FaFileInvoiceDollar,
  FaStar,
  FaMoneyCheck
} from 'react-icons/fa';

interface HubMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: FaHome, label: 'Home', href: '/home', isActive: true },
  { icon: FaChartLine, label: 'Invest', href: '/invest' },
  { icon: FaPaperPlane, label: 'Send', href: '/send' },
  { icon: FaMoneyCheck, label: 'Cheques', href: '/cheques' },
  { icon: FaCreditCard, label: 'Cards', href: '/cards' },
  { icon: FaGem, label: 'Credit', href: '/credit' },
  { icon: FaPiggyBank, label: 'Save', href: '/save' },
  { icon: FaBullseye, label: 'IPO', href: '/ipo' },
  { icon: FaFileInvoiceDollar, label: 'Pay Bills', href: '/pay-bills' },
  { icon: FaStar, label: 'Rewards', href: '/rewards' },
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 rounded-t-3xl pb-[env(safe-area-inset-bottom)]"
          >
            {/* Close Button */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-full p-4 text-white transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Title */}
            <div className="pt-6 px-6">
              <h1 className="text-2xl font-bold text-white">Hub</h1>
            </div>

            {/* Menu Content */}
            <div className="px-4 pt-6 pb-6">
              <div className="grid grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-colors
                      ${item.isActive 
                        ? 'bg-indigo-600/20 text-indigo-400' 
                        : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/50'}`}
                  >
                    <item.icon size={24} />
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2">
              <div className="text-center text-sm text-gray-400">
                <p>Licensed and regulated by the Central Bank UAE</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 