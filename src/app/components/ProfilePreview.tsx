'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Strategy {
  title: string;
  gain: number;
  winRate: number;
  riskRatio: string;
}

interface ProfilePreviewProps {
  username: string;
  isVerified?: boolean;
  avatarUrl: string;
  bio: string;
  hashtags: string[];
  strategies?: Strategy[];
}

export default function ProfilePreview({ 
  username, 
  isVerified = false, 
  avatarUrl, 
  bio, 
  hashtags,
  strategies = []
}: ProfilePreviewProps) {
  const [currentStrategyIndex, setCurrentStrategyIndex] = useState(0);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-zinc-800/50">
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-medium text-white">Live preview</h1>
        <div className="w-5" /> {/* Spacer for alignment */}
      </div>

      {/* Profile Card */}
      <div className="p-4">
        <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/30 overflow-hidden backdrop-blur-xl">
          <div className="p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11">
                <Image
                  src={avatarUrl}
                  alt={username}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-white font-medium">@{username}</span>
                  {isVerified && (
                    <svg className="w-4 h-4 text-[#1D9BF0]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-zinc-500 text-sm">tradr.co/@{username}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[15px] text-zinc-200 leading-snug">{bio}</p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-zinc-800/50 text-white px-3 py-1.5 rounded-full text-sm"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>

            {/* Strategy Section */}
            {strategies.length > 0 && (
              <div className="space-y-3 mt-2">
                <div className="text-sm text-zinc-400">{strategies[currentStrategyIndex].title}</div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[#4ADE80] text-xl font-medium">+{strategies[currentStrategyIndex].gain}%</div>
                    <div className="text-zinc-500 text-sm">Gain</div>
                  </div>
                  <div>
                    <div className="text-white text-xl font-medium">{strategies[currentStrategyIndex].winRate}%</div>
                    <div className="text-zinc-500 text-sm">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-white text-xl font-medium">{strategies[currentStrategyIndex].riskRatio}</div>
                    <div className="text-zinc-500 text-sm">Risk Ratio</div>
                  </div>
                </div>

                {/* Strategy Dots */}
                {strategies.length > 1 && (
                  <div className="flex justify-center items-center gap-1 pt-2">
                    {strategies.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStrategyIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentStrategyIndex ? 'bg-indigo-500' : 'bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Verification Badge */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-800/30">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-400 text-sm">Verified via Tradr</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 