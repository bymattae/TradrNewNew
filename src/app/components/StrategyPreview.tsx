'use client';

import Image from 'next/image';

interface Strategy {
  title: string;
  description: string;
  tags: string[];
  stats?: {
    gain: number;
    winRate: number;
    riskRatio: string;
  };
  cta?: {
    text: string;
    url: string;
  };
}

interface StrategyPreviewProps {
  username: string;
  avatarUrl?: string;
  strategy: {
    title: string;
    description: string;
    tags: string[];
    stats: {
      gain: number;
      winRate: number;
      riskRatio: string;
    };
    cta: {
      text: string;
      url: string;
    };
  };
}

export default function StrategyPreview({ username, avatarUrl, strategy }: StrategyPreviewProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 space-y-4">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-lg">{username[0].toUpperCase()}</span>
          )}
        </div>
        <div>
          <p className="text-white font-medium">{username}</p>
        </div>
      </div>

      {/* Strategy Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{strategy.title}</h3>
        <p className="text-gray-400 text-sm">{strategy.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {strategy.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-white"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
        <div>
          <p className="text-sm text-gray-400">Gain</p>
          <p className="text-lg font-semibold text-green-400">+{strategy.stats.gain}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Win Rate</p>
          <p className="text-lg font-semibold text-white">{strategy.stats.winRate}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Risk Ratio</p>
          <p className="text-lg font-semibold text-white">{strategy.stats.riskRatio}</p>
        </div>
      </div>

      {/* CTA */}
      <a
        href={strategy.cta.url}
        className="block w-full text-center py-2 px-4 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors"
      >
        {strategy.cta.text}
      </a>
    </div>
  );
} 