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
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Header - Updated with shadow and proper positioning */}
      <div className="w-full bg-[#080808] fixed top-0 left-0 right-0 z-10 shadow-sm">
        <div className="max-w-[390px] mx-auto px-4 py-3 flex justify-between items-center">
          <div className="w-6"></div> {/* Spacer for centering */}
          <h1 className="text-lg font-bold text-white">My Tradr</h1>
          <button className="w-6 h-6 flex items-center justify-center text-white/80 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content container with top padding for the fixed header */}
      <div className="w-full pt-[72px] pb-24">
        <div className="max-w-[390px] mx-auto px-4 space-y-5 mt-5">
          {/* Live URL Card - Using the CopyableUrl component */}
          <CopyableUrl username="mattjames" />

          {/* Profile Preview */}
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

      {/* Bottom Action Buttons - Removed as they're no longer needed in the authenticated layout */}
    </main>
  );
} 