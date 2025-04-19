'use client';

import Image from 'next/image';

interface ProfilePreviewProps {
  username: string;
  isVerified: boolean;
  avatarUrl: string;
  bio: string;
  hashtags: string[];
  strategies: Array<{
    name: string;
    gain: number;
    winRate: number;
    riskRatio: number;
  }>;
  currentStrategyIndex?: number;
}

export default function ProfilePreview({
  username,
  isVerified,
  avatarUrl,
  bio,
  hashtags,
  strategies,
  currentStrategyIndex = 0,
}: ProfilePreviewProps) {
  return (
    <div className="w-full bg-zinc-900/90 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-5 space-y-4">
        {/* Avatar and Username */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700/50">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={username}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-semibold text-white">@{username}</h3>
              {isVerified && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-zinc-500">tradr.co/@{username}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-zinc-300 text-sm">{bio || 'No bio yet'}</p>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm font-medium"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}

        {/* Strategy Stats */}
        {strategies.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-base font-medium text-white">{strategies[currentStrategyIndex].name}</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl font-semibold text-emerald-500">
                  +{strategies[currentStrategyIndex].gain.toFixed(1)}%
                </p>
                <p className="text-sm text-zinc-500">Gain</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">
                  {strategies[currentStrategyIndex].winRate}%
                </p>
                <p className="text-sm text-zinc-500">Win Rate</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">
                  1:{strategies[currentStrategyIndex].riskRatio}
                </p>
                <p className="text-sm text-zinc-500">Risk Ratio</p>
              </div>
            </div>

            {/* Strategy Dots */}
            {strategies.length > 1 && (
              <div className="flex justify-center gap-1 pt-2">
                {strategies.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentStrategyIndex ? 'bg-indigo-500' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verified Badge */}
        {isVerified && (
          <div className="flex items-center gap-2 text-sm text-zinc-400 pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Verified via Tradr</span>
          </div>
        )}
      </div>
    </div>
  );
} 