import { TradrIcon } from '@/app/components/Icons';

export default function Footer() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <h2 className="text-2xl font-semibold text-white">
        Join my free telegram channel!
      </h2>
      <p className="text-base text-gray-400">
        Get involved with other alphas and start scaling. This is your time right now.
      </p>
      <button className="mt-2 w-full rounded-xl bg-[#7000FF] py-4 text-lg font-medium text-white">
        Join Channel
      </button>
      <div className="flex items-center justify-center gap-1.5 mt-4 mb-2">
        <TradrIcon className="w-4 h-4 text-white/50" />
        <span className="text-sm text-white/50">Powered by Tradr</span>
      </div>
    </div>
  );
} 