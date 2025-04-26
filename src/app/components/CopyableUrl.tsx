import { useState } from 'react';
import { motion } from 'framer-motion';

interface CopyableUrlProps {
  username: string;
}

export default function CopyableUrl({ username }: CopyableUrlProps) {
  const [copied, setCopied] = useState(false);
  const url = `tradr.co/@${username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">🚀</span>
        <div>
          <p className="text-white/60 text-sm">Your Tradr is live:</p>
          <a 
            href={`https://${url}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-violet-400 hover:text-violet-300 transition-colors font-mono text-base"
          >
            {url}
          </a>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
      >
        {copied ? (
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 20 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap"
        >
          Copied!
        </motion.span>
      </button>
    </motion.div>
  );
} 