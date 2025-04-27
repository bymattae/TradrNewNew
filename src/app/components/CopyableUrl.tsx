'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { FaXTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa6';

interface CopyableUrlProps {
  username: string;
}

export default function CopyableUrl({ username }: CopyableUrlProps) {
  const [copied, setCopied] = useState(false);
  const url = `tradr.io/${username}`;
  const fullUrl = `https://${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOnWhatsapp = () => {
    const whatsappUrl = `https://wa.me/?text=Check%20out%20my%20trader%20profile%20on%20${encodeURIComponent(fullUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=Check%20out%20my%20trader%20profile&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=Check%20out%20my%20trader%20profile`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-4 rounded-xl border border-[#222] mb-3">
        <h3 className="font-semibold text-lg text-white mb-3">Your Tradr is live!</h3>
        
        {/* URL display and copy button */}
        <div className="flex items-center mb-3">
          <a 
            href={fullUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#0A0A0A] flex-1 p-2.5 rounded-l-lg text-white/80 truncate hover:text-white transition-colors"
          >
            {url}
          </a>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`p-2.5 rounded-r-lg flex items-center justify-center ${
              copied ? 'bg-green-500/20 text-green-400' : 'bg-[#161616] text-white/80 hover:text-white'
            }`}
          >
            {copied ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiCopy className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        
        {/* Share buttons */}
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-sm">Share:</p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareOnTwitter}
              className="p-2 bg-[#161616] rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <FaXTwitter className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareOnWhatsapp}
              className="p-2 bg-[#161616] rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareOnTelegram}
              className="p-2 bg-[#161616] rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <FaTelegram className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 