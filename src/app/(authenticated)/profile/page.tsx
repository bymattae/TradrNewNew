'use client';

import { Settings, Edit2, Share2, Palette } from 'lucide-react';
import CopyableUrl from '@/app/components/CopyableUrl';
import ProfilePreview from '@/app/components/ProfilePreview';
import { useState } from 'react';

export default function ProfilePage() {
  // Handlers for the profile preview buttons
  const handleEditClick = () => {
    console.log('Edit clicked');
  };
  
  const handleShareClick = () => {
    console.log('Share clicked');
  };
  
  const handleThemeClick = () => {
    console.log('Theme clicked');
  };

  return (
    <main className="h-[844px] w-full bg-black text-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full bg-[#080808] shadow-sm">
        <div className="w-full mx-auto px-4 py-3 flex justify-between items-center">
          <div className="w-6"></div> {/* Spacer for centering */}
          <h1 className="text-lg font-bold text-white">My Tradr</h1>
          <button className="w-6 h-6 flex items-center justify-center text-white/80 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content container with consistent spacing */}
      <div className="w-full px-4 flex-1 flex flex-col gap-6 pt-6">
        {/* Live URL Card - Using the CopyableUrl component */}
        <CopyableUrl username="mattjames" />

        {/* Profile Preview - Scaled down slightly */}
        <div className="transform scale-[0.98]">
          <ProfilePreview 
            username="mattjames"
            bio="I'm a professional trader from Cardiff looking to level up my skills in trading."
            tags={['#crypto', '#defi', '#trading']}
            strategies={[{
              title: 'Main Strategy',
              stats: {
                gain: 47,
                winRate: 89,
                riskRatio: '1:2.5'
              }
            }]}
            links={[{
              title: 'Join my Premium Strategy Course',
              description: 'Get access to my proven strategy for consistent gains in any market condition.',
              cta: {
                text: 'Get Access Now',
                url: '#'
              }
            }]}
            onEditClick={handleEditClick}
            onShareClick={handleShareClick}
            onThemeClick={handleThemeClick}
          />
        </div>
      </div>
    </main>
  );
} 