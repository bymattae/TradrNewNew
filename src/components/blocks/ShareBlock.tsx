import { Copy } from 'lucide-react';
import Image from 'next/image';

interface ShareBlockProps {
  username: string;
}

export default function ShareBlock({ username }: ShareBlockProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(`tradr.co/${username}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-white">Your Tradr is live:</span>
        <span className="rounded-lg bg-black/40 px-3 py-1.5 text-sm text-white/80">
          tradr.co/{username}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleCopy}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/5"
        >
          <Copy className="h-4 w-4 text-white" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/5">
          <Image src="/whatsapp.svg" width={16} height={16} alt="WhatsApp" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/5">
          <Image src="/twitter.svg" width={16} height={16} alt="Twitter" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/5">
          <Image src="/telegram.svg" width={16} height={16} alt="Telegram" />
        </button>
      </div>
    </div>
  );
} 