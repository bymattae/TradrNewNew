import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

interface CopyableUrlProps {
  username: string;
}

export default function CopyableUrl({ username }: CopyableUrlProps) {
  const [copied, setCopied] = useState(false);
  const url = `tradr.co/@${username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="w-full bg-[#111111] rounded-xl p-3.5 flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div>
          <p className="text-white/80 text-xs mb-0.5">Your Tradr is live:</p>
          <div className="flex items-center">
            <a 
              href={`https://${url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm"
            >
              {url}
            </a>
            <button
              onClick={handleCopy}
              className="ml-1.5 p-1 rounded-full hover:bg-white/10 transition-colors relative"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 10 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap bg-black/70 px-2 py-1 rounded"
              >
                Copied!
              </motion.span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* WhatsApp */}
        <a 
          href={`https://wa.me/?text=Check%20out%20my%20trading%20profile%20at%20${encodeURIComponent(`https://${url}`)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22.5C17.8223 22.5 22.5 17.8223 22.5 12C22.5 6.17766 17.8223 1.5 12 1.5C6.17766 1.5 1.5 6.17766 1.5 12C1.5 13.778 1.95 15.4473 2.74996 16.9022L1.73682 21.484C1.68083 21.7252 1.87582 21.9613 2.12373 21.9414L6.60956 21.4652C8.05656 22.1411 9.6818 22.5 12 22.5Z" strokeWidth="1.5" stroke="currentColor" fill="transparent"/>
          </svg>
        </a>
        
        {/* X (Twitter) */}
        <a 
          href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20trading%20profile%20at%20${encodeURIComponent(`https://${url}`)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        
        {/* Telegram */}
        <a 
          href={`https://t.me/share/url?url=${encodeURIComponent(`https://${url}`)}&text=Check%20out%20my%20trading%20profile!`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.321.072.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
      </div>
    </motion.div>
  );
} 