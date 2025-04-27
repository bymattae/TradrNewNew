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
      className="w-full max-w-[390px] mx-auto"
    >
      <div className="bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-3 rounded-[20px] border border-[#222] mb-3">
        <h3 className="font-semibold text-base text-white mb-2">Your Tradr is live!</h3>
        
        {/* Combined URL and share section in one row */}
        <div className="flex items-center">
          {/* URL display and copy button */}
          <div className="flex flex-1 items-center">
            <a 
              href={fullUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#0A0A0A] flex-1 px-2.5 py-1.5 rounded-l-lg text-sm text-white/80 truncate hover:text-white transition-colors"
            >
              {url}
            </a>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={`px-2 py-1.5 rounded-r-lg flex items-center justify-center ${
                copied ? 'bg-green-500/20 text-green-400' : 'bg-[#161616] text-white/80 hover:text-white'
              }`}
            >
              {copied ? (
                <FiCheck className="w-4 h-4" />
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </motion.button>
          </div>
          
          {/* Divider */}
          <div className="mx-3 text-white/20 text-xs">|</div>
          
          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <p className="text-white/60 text-xs mr-1">Share:</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareOnTwitter}
              className="p-1.5 bg-[#161616] rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <FaXTwitter className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareOnWhatsapp}
              className="p-1.5 bg-[#161616] rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <FaWhatsapp className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareOnTelegram}
              className="p-1.5 bg-[#161616] rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <FaTelegram className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 