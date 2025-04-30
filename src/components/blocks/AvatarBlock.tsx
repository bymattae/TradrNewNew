import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AvatarBlockProps {
  username: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
}

export default function AvatarBlock({ username, bio, avatarUrl, tags }: AvatarBlockProps) {
  const router = useRouter();

  return (
    <div className="relative w-full rounded-2xl bg-[#141414] p-6">
      {/* Edit button */}
      <button 
        onClick={() => router.push('/settings/profile')}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60"
      >
        <Pencil className="h-5 w-5 text-white" />
      </button>

      {/* Profile content */}
      <div className="flex flex-col items-center">
        {/* Avatar with online indicator */}
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-black">
            <Image
              src={avatarUrl || '/default-avatar.png'}
              alt="Profile"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-black" />
        </div>

        {/* Username and Bio */}
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-white">@{username}</h2>
          <p className="mt-2 text-sm text-gray-400">{bio}</p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {tags.map((tag, index) => {
            // Different styling for Web3 tag
            const isWeb3 = tag.toLowerCase().includes('web3');
            return (
              <span
                key={index}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  isWeb3
                    ? 'bg-[#0D3229] text-[#10B981]'
                    : 'bg-[#2D1B69] text-[#7C3AED]'
                }`}
              >
                #{tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
} 