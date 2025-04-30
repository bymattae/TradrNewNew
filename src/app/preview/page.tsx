'use client';

import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Navbar from '@/components/nav/Navbar';
import AvatarBlock from '@/components/blocks/AvatarBlock';
import StatsBlock from '@/components/blocks/StatsBlock';
import CTABlock from '@/components/blocks/CTABlock';
import HubButton from '@/components/ui/HubButton';

export default function Dashboard2Page() {
  const router = useRouter();

  const handleHubClick = () => {
    router.push('/hub');
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/your_channel', '_blank');
  };

  return (
    <DashboardLayout>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col space-y-4 p-4">
        {/* Avatar Block */}
        <AvatarBlock
          username="cryptowhale"
          bio="NFT Collector | DeFi Explorer | Web3 Native 🌊"
          avatarUrl="/default-avatar.png"
          tags={['NFTTrader', 'DeFiWhale', 'Web3']}
        />

        {/* Stats Block */}
        <StatsBlock
          gain={12.5}
          winRate={89}
          avgRR="1:3"
        />

        {/* CTA Block */}
        <CTABlock
          title="Join my free telegram channel!"
          description="Get involved with other alphas and start scaling. This is your time right now."
          buttonText="Check it out"
          onClick={handleTelegramClick}
        />
      </div>

      {/* Hub Button */}
      <HubButton onClick={handleHubClick} />
    </DashboardLayout>
  );
} 