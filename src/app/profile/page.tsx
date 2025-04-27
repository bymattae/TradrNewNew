'use client';

import { Settings, Edit2, Share2, Palette } from 'lucide-react';
import CopyableUrl from '../components/CopyableUrl';
import ProfilePreview from '../components/ProfilePreview';
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
        <div className="max-w-[390px] mx-auto px-4 space-y-2">
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

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0">
        <div className="max-w-[390px] mx-auto px-4">
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleEditClick}
              className="p-3 rounded-xl bg-[#1A1A1A] text-white/80 hover:text-white flex flex-col items-center"
            >
              <Edit2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Edit</span>
            </button>
            <button 
              onClick={handleShareClick}
              className="p-3 rounded-xl bg-[#1A1A1A] text-white/80 hover:text-white flex flex-col items-center"
            >
              <Share2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Share</span>
            </button>
            <button 
              onClick={handleThemeClick}
              className="p-3 rounded-xl bg-[#1A1A1A] text-white/80 hover:text-white flex flex-col items-center"
            >
              <Palette className="w-5 h-5 mb-1" />
              <span className="text-xs">Theme</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 